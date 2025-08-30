import { NextResponse } from 'next/server';

export async function GET() {
  // Test if environment variables are loaded
  const envCheck = {
    groqApiKeyExists: !!process.env.GROQ_API_KEY,
    upstashUrlExists: !!process.env.UPSTASH_VECTOR_REST_URL,
    upstashTokenExists: !!process.env.UPSTASH_VECTOR_REST_TOKEN,
    ollamaUrlExists: !!process.env.OLLAMA_BASE_URL,
    embedModelExists: !!process.env.EMBED_MODEL,
    llmModelExists: !!process.env.LLM_MODEL,
    
    // Show first few characters (for debugging - remove in production)
    groqApiKeyPreview: process.env.GROQ_API_KEY?.substring(0, 8) + '...',
    upstashUrlPreview: process.env.UPSTASH_VECTOR_REST_URL?.substring(0, 20) + '...',
  };

  return NextResponse.json({
    message: 'Environment variables test',
    timestamp: new Date().toISOString(),
    envCheck,
  });
}