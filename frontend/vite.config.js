import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure we're building for production
  mode: 'production',
  // Ensure proper build settings
  build: {
    // Generate source maps for better debugging
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Ensure output directory is correct
    outDir: 'dist',
    // Optimize build
    minify: 'terser',
  },
  // Ensure proper resolution of files
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
