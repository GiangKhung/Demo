#!/bin/bash

echo "🚀 Starting DocShare Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to frontend directory
cd DocShare

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Please create it with backend API URL."
    echo "   NEXT_PUBLIC_API_URL=http://localhost:5000/api"
    echo "   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting frontend server..."
npm run dev
