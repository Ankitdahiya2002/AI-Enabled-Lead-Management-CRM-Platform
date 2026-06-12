#!/bin/bash
# TFU CRM — Start Script
# Usage: ./start.sh

echo "🚀 Starting TFU CRM..."
cd "$(dirname "$0")"

# Activate venv if it exists
if [ -d "venv" ]; then
  source venv/bin/activate
fi

# Check .env
if [ ! -f ".env" ]; then
  echo "❌ .env file missing! Please copy .env.example and fill in your credentials."
  exit 1
fi

echo "✅ Environment loaded"
echo "🌐 Opening http://localhost:5000"
echo ""

# Start Flask
python app.py
