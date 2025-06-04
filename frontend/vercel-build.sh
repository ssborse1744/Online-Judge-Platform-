#!/bin/bash

echo "=== Vercel Build Script ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"

# List contents
echo "Directory contents:"
ls -la

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check package.json
echo "Package.json scripts:"
cat package.json | grep -A 10 '"scripts"'

# Try different vite execution methods
echo "Attempting Vite build..."

if [ -f "./node_modules/.bin/vite" ]; then
    echo "Using local Vite binary"
    ./node_modules/.bin/vite build
elif command -v npx &> /dev/null; then
    echo "Using npx vite"
    npx vite build
else
    echo "Installing Vite globally and building"
    npm install -g vite
    vite build
fi

echo "Build completed!"
