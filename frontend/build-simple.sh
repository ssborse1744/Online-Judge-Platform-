#!/bin/bash
# Simple build script for Vercel

echo "Starting Vite build..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found, installing dependencies..."
    npm install
fi

# Check if vite is available
if command -v npx vite &> /dev/null; then
    echo "Using npx vite build"
    npx vite build
elif [ -f "node_modules/.bin/vite" ]; then
    echo "Using local vite binary"
    ./node_modules/.bin/vite build
else
    echo "Vite not found, installing and building..."
    npm install vite @vitejs/plugin-react
    npx vite build
fi

echo "Build completed!"
