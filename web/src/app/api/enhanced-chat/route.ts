import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/vector';
import Groq from 'groq-sdk';
import { readFileSync } from 'fs';
import path from 'path';

// Initialize Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// Enhanced system prompt for detailed recipes
const ENHANCED_SYSTEM_PROMPT = `You are a professional culinary assistant with expertise in global cuisines and detailed recipe creation. 

FORMATTING REQUIREMENTS:
- Use proper markdown formatting with clear headings (##, ###)
- Include bullet points for lists and ingredients
- Use multiple paragraphs for detailed explanations
- Add cooking tips, techniques, and cultural context
- Structure responses with clear sections

CONTENT REQUIREMENTS:
- Provide detailed, step-by-step cooking instructions
- Include ingredient measurements and preparation notes
- Mention cooking times, difficulty levels, and serving sizes
- Add nutritional information when available
- Include cultural background and recipe variations
- Suggest ingredient substitutions and cooking tips
- Recommend wine pairings or side dishes when appropriate

RESPONSE STRUCTURE:
1. Brief introduction with cultural context
2. Recipe overview (time, difficulty, servings)
3. Detailed ingredients list with measurements
4. Step-by-step cooking instructions
5. Cooking tips and techniques
6. Serving suggestions and variations
7. Cultural significance or story behind the dish

Always provide comprehensive, helpful responses that educate and inspire the user's culinary journey.`;

export async function POST(request: NextRequest) {
  try {
    const { message, topK = 5 } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Processing enhanced recipe query:', message);

    // Search in vector database for relevant recipes
    const searchResults = await index.query({
      data: message,
      topK,
      includeMetadata: true,
    });

    console.log('Enhanced search results:', searchResults.length);

    // Format sources for response
    const sources = searchResults.map((result, index) => ({
      id: result.id?.toString() || index.toString(),
      score: result.score || 0,
      metadata: {
        text: result.metadata?.text || '',
        name: result.metadata?.name || '',
        cuisine: result.metadata?.cuisine || '',
        category: result.metadata?.category || '',
        difficulty: result.metadata?.difficulty || '',
        cookTime: result.metadata?.cookTime || '',
      }
    }));

    // Create enhanced context with detailed recipe information
    const contextTexts = searchResults
      .map(result => {
        const metadata = result.metadata;
        return `Recipe: ${metadata?.name || 'Unknown'}
Cuisine: ${metadata?.cuisine || 'Various'}
Category: ${metadata?.category || 'Main Course'}
Difficulty: ${metadata?.difficulty || 'Medium'}
Cook Time: ${metadata?.cookTime || 'Unknown'} minutes
Description: ${metadata?.text || ''}`;
      })
      .join('\n\n');

    // Generate enhanced response with Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: ENHANCED_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Based on this context about recipes and cuisines:

${contextTexts}

Please answer this question: ${message}

Provide a comprehensive response with detailed recipe information, cooking instructions, and cultural context.`,
        },
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const answer = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';

    // Extract recipe information if available
    let recipeInfo = null;
    const topResult = searchResults[0];
    if (topResult && topResult.metadata) {
      recipeInfo = {
        name: topResult.metadata.name,
        cookTime: topResult.metadata.cookTime,
        difficulty: topResult.metadata.difficulty,
        servings: topResult.metadata.servings || 4,
        cuisine: topResult.metadata.cuisine,
      };
    }

    const response = {
      answer,
      sources,
      query: message,
      timestamp: new Date().toISOString(),
      usage: completion.usage,
      recipe: recipeInfo,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Enhanced chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process your culinary request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}