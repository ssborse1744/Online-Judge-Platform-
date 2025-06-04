import { build } from 'vite';
import { resolve } from 'path';

console.log('🚀 Starting Vite build for production...');

try {
  await build({
    root: process.cwd(),
    mode: 'production',
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        input: resolve(process.cwd(), 'index.html')
      }
    }
  });
  
  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
