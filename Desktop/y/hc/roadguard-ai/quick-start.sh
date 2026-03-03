#!/bin/bash

# RoadGuard AI - Quick Start Script
# Automates setup and launches the application

set -e

echo "🛣️  RoadGuard AI - Quick Start"
echo "=============================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python and Node.js found"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your Supabase credentials"
fi

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo "✅ Backend ready"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please edit frontend/.env.local with your Supabase credentials"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install -q
fi

echo "✅ Frontend ready"
echo ""

echo "════════════════════════════════════════"
echo "🚀 RoadGuard AI is ready to launch!"
echo "════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with Supabase credentials"
echo "2. Edit frontend/.env.local with Supabase credentials"
echo "3. Run: npm run dev (in frontend directory)"
echo "4. In another terminal: python app.py (in backend directory)"
echo "5. Open http://localhost:3000 in browser"
echo ""
echo "For detailed setup, see SETUP.md"
