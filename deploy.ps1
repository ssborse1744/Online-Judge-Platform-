# CodeArena Online Judge - Quick Deployment Script (PowerShell)
# This script helps deploy the application to Vercel

Write-Host "🚀 CodeArena Online Judge - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host ""
    Write-Host "📦 Deploying Backend..." -ForegroundColor Blue
    
    Set-Location backend
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host "✅ Backend deployment initiated" -ForegroundColor Green
    Write-Host "⚠️  Please note your backend URL for frontend configuration" -ForegroundColor Yellow
    Set-Location ..
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host ""
    Write-Host "🎨 Deploying Frontend..." -ForegroundColor Blue
    
    Set-Location frontend
    
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Building application..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host "✅ Frontend deployment initiated" -ForegroundColor Green
    Set-Location ..
}

# Main deployment flow
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "1. Deploy Backend only"
Write-Host "2. Deploy Frontend only" 
Write-Host "3. Deploy Both (Backend first, then Frontend)"
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    1 {
        Deploy-Backend
    }
    2 {
        Deploy-Frontend
    }
    3 {
        Deploy-Backend
        Write-Host ""
        Write-Host "⏳ Please update your frontend .env file with the backend URL before continuing..." -ForegroundColor Yellow
        Read-Host "Press Enter when ready to deploy frontend"
        Deploy-Frontend
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update environment variables in Vercel dashboard"
Write-Host "2. Set up MongoDB Atlas database"
Write-Host "3. Configure CORS with correct frontend URL"
Write-Host "4. Test your deployed application"
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Blue
