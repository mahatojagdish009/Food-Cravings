import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';
import type { RAGResponse, ApiError } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, topK = 3 } = body;

    if (!message) {
      const error: ApiError = {
        error: 'Bad Request',
        message: 'Message parameter is required',
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(error, { status: 400 });
    }

    console.log(`🎯 Chat API: Processing question: "${message}"`);

    // Execute RAG pipeline
    const { answer, sources, usage } = await RAGService.ragQuery(message, topK);

    const response: RAGResponse = {
      answer,
      sources,
      query: message,
      timestamp: new Date().toISOString(),
      usage,
    };

    console.log(`✅ Chat API: Generated response (${answer.length} chars)`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Chat API error:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    const apiError: ApiError = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(apiError, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  try {
    console.log('🏥 Health check requested');
    
    const health = await RAGService.healthCheck();
    
    return NextResponse.json({
      status: health.overall ? 'healthy' : 'unhealthy',
      services: {
        upstashVector: health.upstash ? 'healthy' : 'unhealthy',
        groqLLM: health.groq ? 'healthy' : 'unhealthy',
      },
      timestamp: new Date().toISOString(),
    }, {
      status: health.overall ? 200 : 503
    });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    const apiError: ApiError = {
      error: 'Service Unavailable',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(apiError, { status: 503 });
  }
}