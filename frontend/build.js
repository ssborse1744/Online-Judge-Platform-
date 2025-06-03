// Build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Install dependencies explicitly
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Check vite installation
console.log('Checking vite installation...');
const viteDir = path.join(process.cwd(), 'node_modules', 'vite');
const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite');

if (fs.existsSync(viteDir)) {
  console.log(`Vite installed at: ${viteDir}`);
  if (fs.existsSync(viteBin)) {
    console.log(`Vite binary found at: ${viteBin}`);
  } else {
    console.log('Vite binary not found - will use npx');
  }
} else {
  console.log('Vite not found in node_modules - installing explicitly');
  execSync('npm install --save vite', { stdio: 'inherit' });
}

// Run build using npx
console.log('Running build with npx...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
