#!/bin/bash

# Exit on error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Show node_modules/vite location and size
echo "Checking vite installation..."
if [ -d "node_modules/vite" ]; then
  echo "Vite installed at $(ls -la node_modules/vite)"
  ls -la node_modules/.bin/vite
else
  echo "Vite not found in node_modules - installing explicitly"
  npm install --save vite
fi

# Show PATH
echo "PATH: $PATH"

# Run build using npx
echo "Running build with npx..."
npx vite build

echo "Build completed successfully"
