#!/bin/bash

# This script is used by Vercel to build the frontend
set -e

echo "--- VERCEL BUILD START ---"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

# Ensure we have the latest version of npm
npm install -g npm@latest

# Install dependencies (including dev dependencies)
echo "Installing dependencies..."
npm install --include=dev --force

# Make sure vite is installed globally for this build
echo "Installing vite globally..."
npm install -g vite @vitejs/plugin-react

# Display where vite is installed
echo "Vite location:"
which vite || echo "Vite not found in PATH"
ls -la node_modules/.bin/vite || echo "Vite not found in node_modules/.bin"

# Build the project
echo "Building project..."
NODE_ENV=production npx vite build

echo "--- VERCEL BUILD COMPLETE ---"
