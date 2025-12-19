# EEU CAFE Backend Startup Script
Write-Host "🚀 Starting EEU CAFE Backend Server..." -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
Set-Location "$PSScriptRoot\backend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please edit backend/.env and set your ADMIN_KEY!" -ForegroundColor Red
    Write-Host ""
}

# Check if data directory exists
if (-not (Test-Path "data")) {
    Write-Host "📁 Creating data directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "data" | Out-Null
    Write-Host ""
}

Write-Host "✅ Starting server on http://localhost:5000" -ForegroundColor Green
Write-Host "📊 Health check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "💾 Database will be created at: backend/data/eeu-cafe.db" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev
