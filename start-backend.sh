#!/bin/bash
echo "🚀 Starting CareerAI Backend Server..."
echo "📡 Backend will be available at: http://localhost:5001"
echo "🔗 API Health Check: http://localhost:5001/api/health"
echo ""
cd backend && node src/index.js