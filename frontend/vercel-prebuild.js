import fs from 'fs';
import path from 'path';

console.log('Running Vercel pre-build script...');

// Check if we're in a Vercel environment
if (process.env.VERCEL === '1') {
  console.log('Detected Vercel environment');
  
  // Back up the original package.json
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'package.json.original');
    console.log('Original package.json backed up to package.json.original');
  }
  
  // If a special Vercel-specific package.json exists, use it
  if (fs.existsSync('vercel-package.json')) {
    fs.copyFileSync('vercel-package.json', 'package.json');
    console.log('Replaced package.json with vercel-package.json for Vercel deployment');
  }
}

console.log('Vercel pre-build script completed');
