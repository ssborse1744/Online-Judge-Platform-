#!/usr/bin/env node

console.log('🔍 CodeArena Deployment Verification');
console.log('====================================');

import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function verify() {
  const checks = [];
  
  // Check 1: package.json dependencies
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasVite = pkg.dependencies?.vite;
    const hasVitePlugin = pkg.dependencies?.['@vitejs/plugin-react'];
    
    checks.push({
      name: 'Vite in dependencies',
      status: hasVite ? '✅' : '❌',
      message: hasVite ? `vite@${hasVite}` : 'Vite not found in dependencies'
    });
    
    checks.push({
      name: 'Vite React plugin',
      status: hasVitePlugin ? '✅' : '❌', 
      message: hasVitePlugin ? `@vitejs/plugin-react@${hasVitePlugin}` : 'Plugin not found'
    });
  } catch (error) {
    checks.push({
      name: 'package.json',
      status: '❌',
      message: 'Cannot read package.json'
    });
  }
  
  // Check 2: vercel.json configuration
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    const buildCommand = vercelConfig.buildCommand;
    
    checks.push({
      name: 'Vercel build command',
      status: buildCommand?.includes('npx vite build') ? '✅' : '❌',
      message: `Build command: ${buildCommand}`
    });
  } catch (error) {
    checks.push({
      name: 'vercel.json',
      status: '❌',
      message: 'Cannot read vercel.json'
    });
  }
  
  // Check 3: Local build test
  try {
    console.log('\n🧪 Testing local build...');
    const { stdout } = await execAsync('npx vite build --dry-run || npx vite build', {
      timeout: 60000
    });
    
    checks.push({
      name: 'Local build test',
      status: '✅',
      message: 'Build command executes successfully'
    });
  } catch (error) {
    checks.push({
      name: 'Local build test',
      status: '❌',
      message: `Build failed: ${error.message}`
    });
  }
  
  // Check 4: Environment files
  const envExists = fs.existsSync('.env') || fs.existsSync('.env.production');
  checks.push({
    name: 'Environment configuration',
    status: envExists ? '✅' : '⚠️',
    message: envExists ? 'Environment files found' : 'No .env files found'
  });
  
  // Display results
  console.log('\n📊 Verification Results:');
  console.log('========================');
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.message}`);
  });
  
  const passed = checks.filter(c => c.status === '✅').length;
  const total = checks.length;
  
  console.log(`\n📈 Summary: ${passed}/${total} checks passed`);
  
  if (passed === total) {
    console.log('\n🎉 All checks passed! Ready for Vercel deployment.');
    console.log('\n🚀 Deploy with: vercel --prod');
  } else {
    console.log('\n⚠️ Some checks failed. Please review the issues above.');
  }
}

verify().catch(console.error);
