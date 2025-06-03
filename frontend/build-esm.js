// This file is used for direct Vite build when other methods fail
import { build } from 'vite';

console.log('Starting direct Vite build through ESM...');

build({
  root: process.cwd(),
  logLevel: 'info',
  mode: 'production',
  configFile: './vite.config.js'
}).then(() => {
  console.log('Vite ESM build completed successfully');
}).catch((err) => {
  console.error('Vite ESM build failed:', err);
  process.exit(1);
});
