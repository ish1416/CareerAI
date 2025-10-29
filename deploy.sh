#!/bin/bash

# CareerAI Railway Deployment Script
echo "🚀 Starting CareerAI deployment..."

# Check if we're deploying backend or frontend based on environment
if [ "$RAILWAY_SERVICE_NAME" = "backend" ] || [ -z "$RAILWAY_SERVICE_NAME" ]; then
    echo "📦 Deploying Backend..."
    cd backend
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Run migrations (only if DATABASE_URL is set)
    if [ ! -z "$DATABASE_URL" ]; then
        echo "🗄️ Running database migrations..."
        npx prisma migrate deploy
    fi
    
    # Start backend server
    echo "🔥 Starting backend server..."
    npm start
    
elif [ "$RAILWAY_SERVICE_NAME" = "frontend" ]; then
    echo "🎨 Deploying Frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    
    # Build frontend
    npm run build
    
    # Serve built files
    echo "🌐 Starting frontend server..."
    npx serve -s dist -l 3000
fi