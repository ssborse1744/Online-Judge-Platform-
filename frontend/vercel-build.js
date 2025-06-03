console.log('===== Starting Vercel Build Process =====');
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Platform: ${process.platform}`);

import { exec, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

// List files in the directory
console.log('==== Directory Contents ====');
try {
  const files = fs.readdirSync('.');
  console.log(files.join('\n'));
} catch (e) {
  console.error('Error listing directory:', e);
}

// Function to execute commands
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`\n==== Running command: ${command} ====`);
    
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`\n❌ Error executing command: ${error}`);
        return reject(error);
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      console.log(`\n✅ Command completed: ${command}`);
      resolve();
    });
  });
};

// Main build function
async function build() {
  try {
    // Print NODE_PATH
    console.log(`NODE_PATH: ${process.env.NODE_PATH || 'not set'}`);
    
    // Check for package.json and read it
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      console.log('Package.json found with dependencies:', Object.keys(pkg.dependencies || {}).length);
    } else {
      console.warn('⚠️ package.json not found!');
    }

    // Make sure vite is installed
    console.log('\n==== Checking for Vite installation ====');
    try {
      const vitePath = require.resolve('vite');
      console.log(`✅ Vite is installed at: ${vitePath}`);
    } catch (e) {
      console.log('⚠️ Vite not found, installing explicitly...');
      // Use both global and local installation to ensure it's available
      await runCommand('npm install --save vite @vitejs/plugin-react');
      await runCommand('npm install -g vite');
    }
    
    // Check for vite binary
    console.log('\n==== Checking Vite binary ====');
    try {
      await runCommand('npx vite --version');
    } catch (e) {
      console.warn('⚠️ npx vite command failed, trying with full path...');
    }

    // Try to create a simple vite project structure if it doesn't exist
    if (!fs.existsSync('index.html')) {
      console.warn('⚠️ index.html not found, this might cause issues with Vite');
    }

    // Run build with different methods to ensure it works
    console.log('\n==== Running build command ====');
    try {
      // Try to use vite directly from node_modules
      const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
      if (fs.existsSync(viteBin)) {
        await runCommand(`${viteBin} build`);
      } else {
        await runCommand('npx vite build');
      }
    } catch (e) {
      console.error('❌ First build attempt failed, trying alternative method:', e);
      await runCommand('npm run build:vite');
    }
    
    console.log('\n✅ Build completed successfully!');
  } catch (error) {
    console.error('\n❌ Build process failed:', error);
    process.exit(1);
  }
}

// Add an extra build script that uses direct Node.js require
console.log('\n==== Adding fallback build script ====');
try {
  const buildScriptContent = `
    #!/usr/bin/env node
    const { build } = require('vite');
    
    build({ 
      root: process.cwd(),
      logLevel: 'info',
      mode: 'production',
      configFile: './vite.config.js'
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  `;
  
  fs.writeFileSync('build-vite.js', buildScriptContent);
  console.log('✅ Created fallback build script: build-vite.js');
  
  // Add the script to package.json
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['build:vite'] = 'node build-vite.js';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ Added build:vite script to package.json');
  }
} catch (e) {
  console.warn('⚠️ Failed to create fallback build script:', e);
}

// Run the build
console.log('\n==== Starting build process ====');
build().catch(err => {
  console.error('❌ Uncaught error in build process:', err);
  process.exit(1);
});
