#!/bin/bash
echo "🌐 Creating public tunnel for RAG Food..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    if command -v brew &> /dev/null; then
        brew install ngrok/ngrok/ngrok
    else
        echo "Please install ngrok manually from https://ngrok.com/download"
        exit 1
    fi
fi

echo "🚀 Starting public tunnel on port 3002..."
echo "⚠️  Make sure your dev server is running first!"
echo "📱 Share the ngrok URL with others to access your app"
echo "🛑 Press Ctrl+C to stop the tunnel"
echo ""

ngrok http 3002