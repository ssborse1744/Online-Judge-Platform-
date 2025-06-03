# Deployment Readiness Check Script
# Verifies that all configurations are ready for Vercel deployment

Write-Host "🔍 CodeArena Deployment Readiness Check" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Check 1: Frontend environment configuration
Write-Host "1. Checking Frontend Configuration..." -ForegroundColor Yellow

if (Test-Path "frontend\.env") {
    $frontendEnv = Get-Content "frontend\.env" -Raw
    if ($frontendEnv -match "VITE_API_BASE_URL=") {
        Write-Host "   ✅ Frontend .env file exists with API configuration" -ForegroundColor Green
    } else {
        $errors += "Frontend .env missing VITE_API_BASE_URL"
    }
} else {
    $warnings += "Frontend .env file not found (using .env.example as template)"
}

if (Test-Path "frontend\.env.example") {
    Write-Host "   ✅ Frontend .env.example exists" -ForegroundColor Green
} else {
    $errors += "Frontend .env.example file missing"
}

# Check 2: Backend environment configuration
Write-Host "2. Checking Backend Configuration..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    $backendEnv = Get-Content "backend\.env" -Raw
    $requiredVars = @("MONGODB_URL", "SECRET_KEY", "PORT", "FRONTEND_URL")
    foreach ($var in $requiredVars) {
        if ($backendEnv -match "$var=") {
            Write-Host "   ✅ $var configured" -ForegroundColor Green
        } else {
            $errors += "Backend .env missing $var"
        }
    }
} else {
    $errors += "Backend .env file not found"
}

if (Test-Path "backend\.env.example") {
    Write-Host "   ✅ Backend .env.example exists" -ForegroundColor Green
} else {
    $errors += "Backend .env.example file missing"
}

# Check 3: Vercel configuration files
Write-Host "3. Checking Vercel Configuration..." -ForegroundColor Yellow

if (Test-Path "frontend\vercel.json") {
    Write-Host "   ✅ Frontend vercel.json exists" -ForegroundColor Green
} else {
    $errors += "Frontend vercel.json missing"
}

if (Test-Path "backend\vercel.json") {
    Write-Host "   ✅ Backend vercel.json exists" -ForegroundColor Green
} else {
    $errors += "Backend vercel.json missing"
}

# Check 4: Package.json files
Write-Host "4. Checking Package Configuration..." -ForegroundColor Yellow

$packageFiles = @("package.json", "frontend\package.json", "backend\package.json")
foreach ($file in $packageFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        $errors += "$file missing"
    }
}

# Check 5: API configuration
Write-Host "5. Checking API Configuration..." -ForegroundColor Yellow

if (Test-Path "frontend\src\api\config.js") {
    $apiConfig = Get-Content "frontend\src\api\config.js" -Raw
    if ($apiConfig -match "API_BASE_URL.*process\.env\.VITE_API_BASE_URL") {
        Write-Host "   ✅ API configuration uses environment variables" -ForegroundColor Green
    } else {
        $errors += "API configuration not using environment variables"
    }
} else {
    $errors += "Frontend API config file missing"
}

# Check 6: Hardcoded localhost URLs
Write-Host "6. Checking for Hardcoded URLs..." -ForegroundColor Yellow

$jsxFiles = Get-ChildItem -Path "frontend\src" -Recurse -Filter "*.jsx" -File
$hardcodedUrls = @()

foreach ($file in $jsxFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "http://localhost:5050") {
        $hardcodedUrls += $file.Name
    }
}

if ($hardcodedUrls.Count -eq 0) {
    Write-Host "   ✅ No hardcoded localhost URLs found" -ForegroundColor Green
} else {
    $errors += "Hardcoded localhost URLs found in: $($hardcodedUrls -join ', ')"
}

# Check 7: Build capability
Write-Host "7. Checking Build Capability..." -ForegroundColor Yellow

Set-Location frontend
try {
    npm run build 2>$null >$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend builds successfully" -ForegroundColor Green
    } else {
        $errors += "Frontend build fails"
    }
} catch {
    $errors += "Frontend build command failed"
}
Set-Location ..

# Check 8: Required tools
Write-Host "8. Checking Required Tools..." -ForegroundColor Yellow

try {
    vercel --version >$null 2>&1
    Write-Host "   ✅ Vercel CLI installed" -ForegroundColor Green
} catch {
    $warnings += "Vercel CLI not installed (install with: npm install -g vercel)"
}

try {
    node --version >$null 2>&1
    Write-Host "   ✅ Node.js installed" -ForegroundColor Green
} catch {
    $errors += "Node.js not installed"
}

try {
    npm --version >$null 2>&1
    Write-Host "   ✅ npm installed" -ForegroundColor Green
} catch {
    $errors += "npm not installed"
}

# Results
Write-Host ""
Write-Host "📊 Deployment Readiness Report" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "🎉 All checks passed! Your project is ready for deployment." -ForegroundColor Green
} else {
    Write-Host "❌ Issues found that need to be resolved:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "1. Run deployment script: .\deploy.ps1"
    Write-Host "2. Set up MongoDB Atlas database"
    Write-Host "3. Configure environment variables in Vercel"
    Write-Host "4. Test your deployed application"
} else {
    Write-Host "1. Fix the issues listed above"
    Write-Host "2. Run this check again"
    Write-Host "3. Proceed with deployment when all checks pass"
}

Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Blue
