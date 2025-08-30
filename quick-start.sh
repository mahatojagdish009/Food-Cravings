#!/bin/bash

# Simple Web Startup Script
echo "🚀 Starting RAG Food Web App on Port 3002..."

# Navigate to web directory
cd /Users/jktheboss/ragfood/web

# Kill any existing process on port 3002
echo "🧹 Cleaning up port 3002..."
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

# Start the server
echo "🌐 Starting Next.js server..."
npm run dev

echo "✅ Server should be running on http://localhost:3002"