/** @type {import('next').NextConfig} */
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
  
  // Clean configuration for production
  experimental: {
    // Modern Next.js features
  },
}

module.exports = nextConfig