#!/bin/bash
echo "🚀 Deploying RAG Food to Vercel..."

# Navigate to web directory
cd "$(dirname "$0")/web"

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Please login to Vercel when prompted..."
vercel login

# Deploy to Vercel
echo "🚀 Deploying..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now accessible worldwide!"