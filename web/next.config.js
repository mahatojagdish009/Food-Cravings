/** @type {import('next').NextConfig} */
// Production deployment with environment variables
const nextConfig = {
  serverExternalPackages: ['@upstash/vector', 'groq-sdk'],
  env: {
    UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN,
    UPSTASH_VECTOR_REST_READONLY_TOKEN: process.env.UPSTASH_VECTOR_REST_READONLY_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    EMBED_MODEL: process.env.EMBED_MODEL,
    LLM_MODEL: process.env.LLM_MODEL,
  },
  // Vercel deployment optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Production deployment ready
  experimental: {
    // Modern Next.js features
  },
}

module.exports = nextConfig