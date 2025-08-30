/** @type {import('next').NextConfig} */
// Production deployment with environment variables
const nextConfig = {
  serverExternalPackages: ['@upstash/vector', 'groq-sdk'],
  env: {
    UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
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