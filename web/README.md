# RAG Food - AI-Powered Food Discovery

🍕 **Smart food recommendations powered by AI and vector search**

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gocallum/ragfood&project-name=ragfood&repository-name=ragfood)

## Features

- 🔍 **Semantic Search**: Find foods by description, ingredients, or cuisine
- 🤖 **AI-Powered Responses**: Get detailed, structured answers about food
- 🌍 **Global Cuisine**: 150+ dishes from around the world
- ⚡ **Real-time**: Fast responses with Groq LLM and Upstash Vector

## Environment Setup

```bash
# Required environment variables
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
GROQ_API_KEY=your_groq_key
```

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Vector DB**: Upstash Vector with mxbai-embed-large-v1
- **LLM**: Groq (llama-3.1-8b-instant)
- **Deployment**: Vercel

## API Endpoints

- `POST /api/chat` - Chat with the food AI
- `POST /api/populate` - Populate database with food items
- `GET /api/chat` - Health check

## Deploy Steps

1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy!

---

*Built with ❤️ using Upstash Vector and Groq*