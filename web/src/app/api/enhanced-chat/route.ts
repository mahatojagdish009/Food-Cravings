import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/vector';
import Groq from 'groq-sdk';

// Lazy initialization functions
function getVectorClient() {
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    throw new Error('Upstash Vector environment variables are missing!');
  }
  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });
}

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing!');
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

// Enhanced system prompt for professional, structured responses
const ENHANCED_SYSTEM_PROMPT = `You are a professional culinary assistant with expertise in global cuisines and detailed recipe creation.

CRITICAL FORMATTING REQUIREMENTS:
- ABSOLUTELY FORBIDDEN: Single-paragraph responses or wall of text
- REQUIRED: Every response MUST have at least 3 sections with ## headings
- REQUIRED: Every response MUST have at least 2 subsections with ### headings
- REQUIRED: Every response MUST include bullet points with detailed explanations
- ALWAYS use proper markdown formatting (##, ###, -, *, etc.)
- Break information into digestible sections with multiple paragraphs
- Include specific details and examples in organized bullet points
- Structure responses with clear hierarchy and logical flow
- MINIMUM response length: 300 words across multiple structured sections

MANDATORY RESPONSE STRUCTURE:
## Recipe Overview
Brief introduction with cultural context and dish significance...

### Quick Facts:
- Cooking Time: [X] minutes
- Difficulty Level: [Easy/Medium/Hard]
- Servings: [X] people
- Cuisine Type: [Regional origin]
- Main Cooking Method: [Technique]

## Ingredients & Preparation

### Main Ingredients:
- [Ingredient 1]: [Amount] - [preparation notes]
- [Ingredient 2]: [Amount] - [preparation notes] 
- [Ingredient 3]: [Amount] - [preparation notes]

### Spices & Seasonings:
- [Spice 1]: [Amount] - [purpose/effect]
- [Spice 2]: [Amount] - [purpose/effect]

## Step-by-Step Cooking Instructions

### Preparation Phase:
1. **Step 1**: Detailed explanation of first preparation step
2. **Step 2**: Clear instructions with timing and techniques
3. **Step 3**: Specific guidance with visual cues

### Cooking Phase:
1. **Main Cooking**: Comprehensive cooking instructions with temperature and timing
2. **Monitoring**: What to look for during cooking process
3. **Final Steps**: Finishing touches and presentation

## Professional Tips & Techniques

### Expert Cooking Tips:
- **Temperature Control**: Specific guidance for heat management
- **Timing Advice**: Critical timing points and indicators
- **Technique Mastery**: Professional methods for best results

### Common Mistakes to Avoid:
- **Mistake 1**: What not to do and why
- **Mistake 2**: Prevention strategies
- **Mistake 3**: Recovery techniques if things go wrong

## Serving & Variations

### Serving Suggestions:
- **Presentation**: How to plate and garnish professionally
- **Accompaniments**: Best side dishes and pairings
- **Storage**: Proper storage and reheating instructions

### Popular Variations:
- **Regional Variants**: Different regional styles and adaptations
- **Dietary Adaptations**: Vegan, gluten-free, or other modifications
- **Seasonal Adjustments**: How to adapt based on ingredient availability

## Cultural Context & Final Notes

Multiple paragraphs about the dish's cultural significance, history, 
traditional occasions when it's served, and interesting facts about 
its origins and evolution. Include personal anecdotes or stories 
that make the recipe more engaging and memorable.

STRICTLY FORBIDDEN:
- Wall of text responses
- Single paragraph answers  
- Unstructured information dumps
- Missing headings or bullet points
- Generic or vague instructions

Always provide comprehensive, professionally structured responses that educate and inspire the user's culinary journey.`;

export async function POST(request: NextRequest) {
  try {
    const { message, topK = 5 } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Processing enhanced recipe query:', message);

    // Search in vector database for relevant recipes
    const index = getVectorClient();
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
    const groq = getGroqClient();
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
      max_tokens: 1500, // Increased for professional structured responses
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