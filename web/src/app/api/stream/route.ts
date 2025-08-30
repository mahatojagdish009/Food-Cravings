import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';
import Groq from 'groq-sdk';

// Initialize Groq client for streaming
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

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

          // System message for food-specific responses
          const systemMessage = `You are a knowledgeable food expert assistant. Your role is to:
- Answer questions about food, recipes, ingredients, and cooking methods
- Provide accurate, helpful, and friendly responses
- Base your answers on the provided context
- If the context doesn't contain enough information, say so clearly
- Include relevant details about cuisines, regions, and food types when available
- Be conversational and engaging while staying informative`;

          const userMessage = `Context from food database:
${contextText}

Question: ${message}

Please provide a helpful answer based on the context above.`;

          console.log('🧠 Generating streaming answer with Groq LLM...');

          const completion = await groqClient.chat.completions.create({
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userMessage }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 500,
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
