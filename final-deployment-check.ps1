Write-Host "=== CodeArena Deployment Verification ===" -ForegroundColor Green

# Change to frontend directory
Set-Location "c:\Users\91801\Desktop\OJ\frontend"

Write-Host "`n1. Checking Node.js and NPM versions..." -ForegroundColor Cyan
Write-Host "Node.js: $(node --version)"
Write-Host "NPM: $(npm --version)"

Write-Host "`n2. Verifying Vite installation..." -ForegroundColor Cyan
try {
    $viteVersion = npx vite --version
    Write-Host "Vite: $viteVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vite not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Testing build process..." -ForegroundColor Cyan
try {
    Write-Host "Running npm run build..."
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        Write-Host $buildOutput
        exit 1
    }
} catch {
    Write-Host "❌ Build error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n4. Verifying build output..." -ForegroundColor Cyan
if (Test-Path "dist\index.html") {
    Write-Host "✅ dist/index.html exists" -ForegroundColor Green
} else {
    Write-Host "❌ dist/index.html missing!" -ForegroundColor Red
    exit 1
}

if (Test-Path "dist\assets") {
    $assetCount = (Get-ChildItem "dist\assets").Count
    Write-Host "✅ Assets folder exists with $assetCount files" -ForegroundColor Green
} else {
    Write-Host "❌ Assets folder missing!" -ForegroundColor Red
    exit 1
}

Write-Host "`n5. Checking Vercel configuration..." -ForegroundColor Cyan
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json exists" -ForegroundColor Green
    $vercelConfig = Get-Content "vercel.json" | ConvertFrom-Json
    Write-Host "Build command: $($vercelConfig.buildCommand)" -ForegroundColor Yellow
    Write-Host "Output directory: $($vercelConfig.outputDirectory)" -ForegroundColor Yellow
} else {
    Write-Host "❌ vercel.json missing!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 ALL CHECKS PASSED!" -ForegroundColor Green
Write-Host "Your CodeArena project is ready for Vercel deployment!" -ForegroundColor Green
Write-Host "`nTo deploy, run: vercel --prod" -ForegroundColor Yellow
