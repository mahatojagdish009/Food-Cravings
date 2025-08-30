import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';
import Groq from 'groq-sdk';

// Lazy initialization function for Groq client
function getGroqClient() {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY!,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, topK = 3 } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🎯 Stream API: Processing question: "${message}"`);

    // Step 1: Search for relevant food items
    const sources = await RAGService.searchFoodItems(message, topK);

    // Create readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send sources first
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: 'sources',
                sources: sources,
              })}\n\n`
            )
          );

          // Generate streaming response
          if (sources.length === 0) {
            const errorMessage = "❌ I couldn't find any relevant food information for your question. Try asking about specific foods, cuisines, or cooking methods.";
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({
                  type: 'token',
                  content: errorMessage,
                })}\n\n`
              )
            );
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ type: 'complete' })}\n\n`
              )
            );
            controller.close();
            return;
          }

          // Build context from retrieved documents
          const contextText = sources
            .map(doc => doc.metadata.text)
            .join('\n');

          // System message for professional structured food responses
          const systemMessage = `You are a professional food expert assistant with expertise in global cuisines.

CRITICAL FORMATTING REQUIREMENTS:
- ABSOLUTELY FORBIDDEN: Single-paragraph responses or wall of text
- REQUIRED: Every response MUST have at least 2 sections with ## headings
- REQUIRED: Every response MUST include bullet points with detailed explanations
- ALWAYS use proper markdown formatting (##, ###, -, *, etc.)
- Break information into digestible sections with multiple paragraphs
- Include specific details and examples in organized bullet points

MANDATORY RESPONSE STRUCTURE:
## Main Information
Brief introduction about the topic...

### Key Points:
- **Point 1**: Detailed explanation with context
- **Point 2**: Specific information with examples
- **Point 3**: Additional relevant details

### Additional Details:
Multiple paragraphs with comprehensive information about preparation methods, 
cultural significance, serving suggestions, and related information.

## Tips & Recommendations

### Practical Advice:
- **Cooking Tips**: Professional guidance and techniques
- **Serving Suggestions**: Best practices for presentation
- **Storage**: Proper handling and storage recommendations

CONTENT GUIDELINES:
- Answer questions about food, recipes, ingredients, and cooking methods
- Provide accurate, helpful, and engaging responses in STRUCTURED FORMAT
- Base your answers on the provided context
- If the context doesn't contain enough information, say so clearly in structured format
- Include relevant details about cuisines, regions, and food types when available
- Be conversational and engaging while staying informative and WELL-ORGANIZED
- STRICTLY FORBIDDEN: Single-paragraph responses - always use structured format with headings`;

          const userMessage = `Context from food database:
${contextText}

Question: ${message}

Please provide a comprehensive, well-structured answer using the formatting guidelines above. Use headings, bullet points, and multiple paragraphs to make the response clear and easy to read.`;

          console.log('🧠 Generating streaming answer with Groq LLM...');

          const groqClient = getGroqClient();
          const completion = await groqClient.chat.completions.create({
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userMessage }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1200, // Increased for structured responses
            stream: true,
          });

          // Stream the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: 'token',
                    content: content,
                  })}\n\n`
                )
              );
            }
          }

          // Send completion signal
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ type: 'complete' })}\n\n`
            )
          );
          
          console.log('✅ Streaming response completed');
          controller.close();

        } catch (error) {
          console.error('❌ Streaming error:', error);
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Stream API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
