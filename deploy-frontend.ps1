# Vue.js Frontend Deployment Script for IIS
# Run this script to build and deploy the Vue.js app to IIS

param(
    [string]$OutputPath = "C:\inetpub\wwwroot\VueNetCrudApp",
    [string]$ProjectPath = "C:\Learn\VueNetCrud\vue-client"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vue.js Frontend Deployment to IIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator. Permissions may fail." -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Build Vue.js Application
Write-Host "[1/4] Building Vue.js application..." -ForegroundColor Green
Set-Location $ProjectPath

if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing dependencies..." -ForegroundColor Gray
    npm install
}

Write-Host "  Building for production..." -ForegroundColor Gray
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "dist")) {
    Write-Host "ERROR: dist folder not found after build!" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Build complete" -ForegroundColor Green
Write-Host ""

# Step 2: Prepare IIS Directory
Write-Host "[2/4] Preparing IIS directory..." -ForegroundColor Green
if (-not (Test-Path $OutputPath)) {
    Write-Host "  Creating directory: $OutputPath" -ForegroundColor Gray
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
} else {
    Write-Host "  Cleaning existing directory..." -ForegroundColor Gray
    Remove-Item "$OutputPath\*" -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "  ✓ Directory ready" -ForegroundColor Green
Write-Host ""

# Step 3: Copy Files
Write-Host "[3/4] Copying files to IIS..." -ForegroundColor Green
Write-Host "  Copying dist files..." -ForegroundColor Gray
Copy-Item "$ProjectPath\dist\*" -Destination $OutputPath -Recurse -Force

# Copy web.config
if (Test-Path "$ProjectPath\web.config") {
    Write-Host "  Copying web.config..." -ForegroundColor Gray
    Copy-Item "$ProjectPath\web.config" -Destination $OutputPath -Force
    Write-Host "  ✓ web.config copied" -ForegroundColor Gray
} else {
    Write-Host "  WARNING: web.config not found! Vue routing may not work." -ForegroundColor Yellow
    Write-Host "  Create web.config file for proper routing support." -ForegroundColor Yellow
}

Write-Host "  ✓ Files copied successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Set Permissions
Write-Host "[4/4] Setting folder permissions..." -ForegroundColor Green
if ($isAdmin) {
    Write-Host "  Granting IIS_IUSRS read permissions..." -ForegroundColor Gray
    icacls $OutputPath /grant "IIS_IUSRS:(OI)(CI)R" /T /Q | Out-Null
    Write-Host "  ✓ Permissions set" -ForegroundColor Green
} else {
    Write-Host "  Skipping permissions (not running as Admin)" -ForegroundColor Yellow
    Write-Host "  Run as Administrator to set permissions automatically" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend Location: $OutputPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open IIS Manager (inetmgr)" -ForegroundColor White
Write-Host "2. Create/Verify website pointing to: $OutputPath" -ForegroundColor White
Write-Host "3. Ensure URL Rewrite Module is installed" -ForegroundColor White
Write-Host "4. Test the application in browser" -ForegroundColor White
Write-Host ""
Write-Host "Default URL: http://localhost" -ForegroundColor Yellow
Write-Host ""

