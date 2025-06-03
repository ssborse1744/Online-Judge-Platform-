# CodeArena Online Judge - Deployment Readiness Check
# This script checks if everything is ready for Vercel deployment

Write-Host "=====================================" -ForegroundColor Green
Write-Host "CodeArena Deployment Readiness Check" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$allChecks = @()

# Function to add check result
function Add-Check {
    param([string]$Name, [bool]$Passed, [string]$Message)
    $allChecks += @{
        Name = $Name
        Passed = $Passed
        Message = $Message
    }
}

# Check 1: Node.js version
try {
    $nodeVersion = node --version
    if ([version]($nodeVersion -replace 'v','') -ge [version]"18.0.0") {
        Add-Check "Node.js Version" $true "✓ $nodeVersion (>= 18.0.0 required)"
    } else {
        Add-Check "Node.js Version" $false "✗ $nodeVersion (>= 18.0.0 required)"
    }
} catch {
    Add-Check "Node.js Version" $false "✗ Node.js not found"
}

# Check 2: NPM version
try {
    $npmVersion = npm --version
    if ([version]$npmVersion -ge [version]"8.0.0") {
        Add-Check "NPM Version" $true "✓ $npmVersion (>= 8.0.0 required)"
    } else {
        Add-Check "NPM Version" $false "✗ $npmVersion (>= 8.0.0 required)"
    }
} catch {
    Add-Check "NPM Version" $false "✗ NPM not found"
}

# Check 3: Vercel CLI
try {
    $vercelVersion = vercel --version
    Add-Check "Vercel CLI" $true "✓ $vercelVersion installed"
} catch {
    Add-Check "Vercel CLI" $false "✗ Vercel CLI not installed (run: npm install -g vercel)"
}

# Check 4: Frontend dependencies
Set-Location "c:\Users\91801\Desktop\OJ\frontend"
if (Test-Path "node_modules") {
    Add-Check "Frontend Dependencies" $true "✓ node_modules exists"
} else {
    Add-Check "Frontend Dependencies" $false "✗ Run 'npm install' in frontend directory"
}

# Check 5: Frontend build test
try {
    $buildResult = npm run build:direct 2>&1
    if ($LASTEXITCODE -eq 0) {
        Add-Check "Frontend Build" $true "✓ Build successful"
    } else {
        Add-Check "Frontend Build" $false "✗ Build failed: $buildResult"
    }
} catch {
    Add-Check "Frontend Build" $false "✗ Build test failed"
}

# Check 6: Backend dependencies
Set-Location "c:\Users\91801\Desktop\OJ\backend"
if (Test-Path "node_modules") {
    Add-Check "Backend Dependencies" $true "✓ node_modules exists"
} else {
    Add-Check "Backend Dependencies" $false "✗ Run 'npm install' in backend directory"
}

# Check 7: Environment files
if (Test-Path ".env.production") {
    Add-Check "Backend Environment" $true "✓ .env.production exists"
} else {
    Add-Check "Backend Environment" $false "✗ .env.production missing"
}

Set-Location "c:\Users\91801\Desktop\OJ\frontend"
if (Test-Path ".env") {
    Add-Check "Frontend Environment" $true "✓ .env exists"
} else {
    Add-Check "Frontend Environment" $false "✗ .env missing"
}

# Check 8: Vercel configuration files
if (Test-Path "vercel.json") {
    Add-Check "Frontend Vercel Config" $true "✓ vercel.json exists"
} else {
    Add-Check "Frontend Vercel Config" $false "✗ vercel.json missing"
}

Set-Location "c:\Users\91801\Desktop\OJ\backend"
if (Test-Path "vercel.json") {
    Add-Check "Backend Vercel Config" $true "✓ vercel.json exists"
} else {
    Add-Check "Backend Vercel Config" $false "✗ vercel.json missing"
}

# Display results
Write-Host "`nCheck Results:" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan

$passedCount = 0
$totalCount = $allChecks.Count

foreach ($check in $allChecks) {
    if ($check.Passed) {
        Write-Host $check.Message -ForegroundColor Green
        $passedCount++
    } else {
        Write-Host $check.Message -ForegroundColor Red
    }
}

Write-Host "`nSummary: $passedCount/$totalCount checks passed" -ForegroundColor Cyan

if ($passedCount -eq $totalCount) {
    Write-Host "`n🎉 All checks passed! Ready for deployment." -ForegroundColor Green
    Write-Host "Run './deploy-to-vercel.ps1' to start deployment." -ForegroundColor Yellow
} else {
    Write-Host "`n⚠️  Please fix the failed checks before deployment." -ForegroundColor Yellow
}

# Return to original directory
Set-Location "c:\Users\91801\Desktop\OJ"
