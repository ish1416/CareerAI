#!/bin/bash

# 🚀 CareerAI Render Deployment Script

echo "🚀 Deploying CareerAI Backend to Render..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Run this script from the CareerAI root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: Backend ready for Render deployment $(date)"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/careerai-backend.git"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a new repository on GitHub named 'careerai-backend'"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/careerai-backend.git"
    echo "3. Run: git push -u origin main"
    echo "4. Follow the deployment guide in RENDER_DEPLOYMENT.md"
    exit 1
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create a new PostgreSQL database"
echo "3. Create a new Web Service from your GitHub repo"
echo "4. Follow the detailed guide in RENDER_DEPLOYMENT.md"
echo ""
echo "🔧 Important: Set the Root Directory to 'backend' in Render settings"
echo ""