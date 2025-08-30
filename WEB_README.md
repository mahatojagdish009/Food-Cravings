# 🍜 RAG Food - AI-Powered Global Cuisine Explorer

> **Advanced RAG system powered by Groq AI, Upstash Vector Database, and Next.js 15**

## ✨ Features

- 🌍 **230+ Global Food Items** across 22+ countries
- 🤖 **Groq AI Integration** with llama-3.1-8b-instant
- 🗄️ **Vector Database** powered by Upstash 
- ⚡ **Next.js 15** with App Router and TypeScript
- 🎨 **Beautiful UI** with Tailwind CSS and enhanced components
- 📱 **Responsive Design** optimized for all devices

## 🚀 Quick Start (Easy Mode!)

### Option 1: Complete Setup (Recommended)
```bash
# Start everything with one command
./start-all.sh
```

### Option 2: Step by Step
```bash
# Start web server only
./start-web.sh

# In another terminal, populate database
./populate-db.sh
```

### Option 3: Production Mode
```bash
# Build and run production server
./start-web-prod.sh

# Then populate database
./populate-db.sh
```

## 🌐 Access Your Application

- **Web Interface**: http://localhost:3002
- **API Endpoint**: http://localhost:3002/api/chat
- **Database Population**: http://localhost:3002/api/populate

## 🛠️ Manual Commands (If Needed)

```bash
# Development (from project root)
cd web && npm run dev

# Production Build
cd web && npm run build && npm run start
```

## 📊 Database Coverage

- **India**: 20 items (Biryani, Samosa, Butter Chicken, etc.)
- **East Asia**: China, Japan, Korea (10 each)
- **Southeast Asia**: Thailand, Vietnam, Indonesia, Malaysia, Philippines (10 each)
- **Europe**: Italy, France, Spain, UK, Germany (10 each)
- **Americas**: Mexico, USA, Canada, Argentina, Brazil, Peru (10 each)
- **Oceania**: Australia, New Zealand (10 each)

## 🔧 Environment Setup

1. Copy `.env.example` to `.env.local` in the `web/` directory
2. Add your API keys:
   ```
   GROQ_API_KEY=your_groq_api_key
   UPSTASH_VECTOR_REST_URL=your_upstash_url
   UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
   ```

## 📱 Usage Examples

- "What are popular Thai street foods?"
- "Tell me about Italian pasta dishes"
- "Recommend some Japanese comfort foods"
- "What Mexican dishes should I try?"

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **AI Model**: Groq (llama-3.1-8b-instant)
- **Vector DB**: Upstash Vector Database
- **Styling**: Tailwind CSS with custom components
- **Port**: Fixed on 3002 (no more port conflicts!)

## 🎯 Key Improvements

- ✅ **Fixed Port Issues**: Always runs on port 3002
- ✅ **Directory Management**: Automated directory handling
- ✅ **Easy Startup Scripts**: One-command setup
- ✅ **Expanded Database**: 230 global food items
- ✅ **Enhanced UI**: Beautiful menus and search
- ✅ **Structured Responses**: Rich formatting with headings and bullets

---

**Made with ❤️ using Groq AI, Upstash, and Next.js 15**