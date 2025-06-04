import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('Starting build...');

try {
  console.log('Running vite build...');
  const { stdout, stderr } = await execAsync('npx vite build', {
    stdio: 'inherit'
  });
  
  console.log('Build output:', stdout);
  if (stderr) console.log('Build errors:', stderr);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
