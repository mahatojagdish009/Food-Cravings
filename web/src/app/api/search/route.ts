import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag-service';
import type { SearchResult, ApiError } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, topK = 3 } = body;

    if (!query) {
      const error: ApiError = {
        error: 'Bad Request',
        message: 'Query parameter is required',
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(error, { status: 400 });
    }

    console.log(`🔍 Search API: "${query}" (topK: ${topK})`);

    const results: SearchResult[] = await RAGService.searchFoodItems(query, topK);

    return NextResponse.json({
      query,
      results,
      count: results.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Search API error:', error);
    
    const apiError: ApiError = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(apiError, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const topK = parseInt(searchParams.get('topK') || '3');

  if (!query) {
    const error: ApiError = {
      error: 'Bad Request', 
      message: 'Query parameter "q" is required',
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(error, { status: 400 });
  }

  try {
    console.log(`🔍 Search API (GET): "${query}" (topK: ${topK})`);
    
    const results: SearchResult[] = await RAGService.searchFoodItems(query, topK);

    return NextResponse.json({
      query,
      results,
      count: results.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ Search API error:', error);
    
    const apiError: ApiError = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(apiError, { status: 500 });
  }
}