#!/bin/bash

# CodeArena Online Judge - Quick Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 CodeArena Online Judge - Vercel Deployment Script"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"

# Function to deploy backend
deploy_backend() {
    echo ""
    echo "📦 Deploying Backend..."
    cd backend
    
    echo "Installing dependencies..."
    npm install
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Backend deployment initiated"
    echo "⚠️  Please note your backend URL for frontend configuration"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo ""
    echo "🎨 Deploying Frontend..."
    cd frontend
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building application..."
    npm run build
    
    echo "Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Frontend deployment initiated"
    cd ..
}

# Main deployment flow
echo ""
echo "Choose deployment option:"
echo "1. Deploy Backend only"
echo "2. Deploy Frontend only" 
echo "3. Deploy Both (Backend first, then Frontend)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        deploy_backend
        echo ""
        echo "⏳ Please update your frontend .env file with the backend URL before continuing..."
        read -p "Press Enter when ready to deploy frontend..."
        deploy_frontend
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📝 Next Steps:"
echo "1. Update environment variables in Vercel dashboard"
echo "2. Set up MongoDB Atlas database"
echo "3. Configure CORS with correct frontend URL"
echo "4. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
