#!/bin/bash
# Script to start the TTS backend server

echo "Starting TTS Backend Server..."
echo "================================"

# Check if dependencies are installed
python3 -c "import edge_tts" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Dependencies not installed!"
    echo "Installing dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        echo "Try running: pip3 install -r requirements.txt"
        exit 1
    fi
fi

# Check if port 8000 is in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 is already in use"
    echo "Killing existing process..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Start the server
echo "🚀 Starting server on http://localhost:8000"
echo ""
python3 server.py

