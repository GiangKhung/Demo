#!/bin/bash

echo "🚀 Starting DocShare Backend..."

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

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update MongoDB URI and other settings."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB connection string is configured
if grep -q "mongodb+srv://username:password" .env; then
    echo "⚠️  Please update MongoDB URI in .env file"
    echo "   Current: mongodb+srv://username:password@cluster.mongodb.net/docshare"
    echo "   Update to: mongodb+srv://docshare:docshare123@docshare.jvs2hih.mongodb.net/docshare"
fi

echo "🌱 Seeding database with sample data..."
npm run seed

echo "🚀 Starting backend server..."
npm run dev
