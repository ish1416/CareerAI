#!/bin/bash

echo "🚀 Starting CareerAI Development Servers..."

# Kill any existing processes on ports 5001 and 5174
echo "🔄 Cleaning up existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Start backend server
echo "🔧 Starting Backend Server (Port 5001)..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting Frontend Server (Port 5174)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Servers started successfully!"
echo "📍 Backend: http://localhost:5001"
echo "📍 Frontend: http://localhost:5174"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait