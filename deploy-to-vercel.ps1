# CodeArena Online Judge - Vercel Deployment Script
# This script deploys both frontend and backend to Vercel

Write-Host "=====================================" -ForegroundColor Green
Write-Host "CodeArena Online Judge Deployment" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "`n--- Deploying Backend ---" -ForegroundColor Cyan
    
    Set-Location "c:\Users\91801\Desktop\OJ\backend"
    
    # Check if .env.production exists
    if (Test-Path ".env.production") {
        Write-Host "Using .env.production for environment variables" -ForegroundColor Green
    } else {
        Write-Host "Warning: .env.production not found" -ForegroundColor Red
        return $false
    }
    
    # Deploy to Vercel
    try {
        Write-Host "Deploying backend to Vercel..." -ForegroundColor Yellow
        $backendResult = vercel --prod --confirm
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Backend deployed successfully!" -ForegroundColor Green
            Write-Host "Backend URL: $backendResult" -ForegroundColor Green
            return $backendResult
        } else {
            Write-Host "Backend deployment failed!" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error deploying backend: $_" -ForegroundColor Red
        return $false
    }
}

# Function to deploy frontend
function Deploy-Frontend {
    param([string]$BackendUrl)
    
    Write-Host "`n--- Deploying Frontend ---" -ForegroundColor Cyan
    
    Set-Location "c:\Users\91801\Desktop\OJ\frontend"
    
    # Update frontend .env with backend URL
    if ($BackendUrl) {
        Write-Host "Updating frontend environment with backend URL: $BackendUrl" -ForegroundColor Yellow
        "VITE_API_BASE_URL=$BackendUrl" | Out-File -FilePath ".env.production" -Encoding UTF8
    }
    
    # Test build first
    Write-Host "Testing build..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build test successful!" -ForegroundColor Green
    } else {
        Write-Host "Build test failed!" -ForegroundColor Red
        return $false
    }
    
    # Deploy to Vercel
    try {
        Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
        $frontendResult = vercel --prod --confirm
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Frontend deployed successfully!" -ForegroundColor Green
            Write-Host "Frontend URL: $frontendResult" -ForegroundColor Green
            return $frontendResult
        } else {
            Write-Host "Frontend deployment failed!" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "Error deploying frontend: $_" -ForegroundColor Red
        return $false
    }
}

# Main deployment process
try {
    # Set initial location
    Set-Location "c:\Users\91801\Desktop\OJ"
    
    # Deploy backend first
    $backendUrl = Deploy-Backend
    
    if ($backendUrl -eq $false) {
        Write-Host "Deployment stopped due to backend failure." -ForegroundColor Red
        exit 1
    }
    
    # Deploy frontend with backend URL
    $frontendUrl = Deploy-Frontend -BackendUrl $backendUrl
    
    if ($frontendUrl -eq $false) {
        Write-Host "Deployment stopped due to frontend failure." -ForegroundColor Red
        exit 1
    }
    
    # Success message
    Write-Host "`n=====================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Backend URL:  $backendUrl" -ForegroundColor Cyan
    Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Cyan
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend FRONTEND_URL environment variable in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Set up MongoDB Atlas connection string" -ForegroundColor White
    Write-Host "3. Test the deployed application" -ForegroundColor White
    
} catch {
    Write-Host "Deployment failed with error: $_" -ForegroundColor Red
    exit 1
}
