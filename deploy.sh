#!/bin/bash

echo "🚀 Starting CareerAI deployment..."

# Check if we're deploying backend or frontend
if [ "$RAILWAY_SERVICE_NAME" = "backend" ] || [ -z "$RAILWAY_SERVICE_NAME" ]; then
    echo "📦 Deploying Backend..."
    cd backend || exit 1
    
    npm install
    npx prisma generate
    
    if [ ! -z "$DATABASE_URL" ]; then
        npx prisma migrate deploy
    fi
    
    npm start
    
elif [ "$RAILWAY_SERVICE_NAME" = "frontend" ]; then
    echo "🎨 Deploying Frontend..."
    cd frontend || exit 1
    
    npm install
    npm run build
    npx serve -s dist -p $PORT
fi