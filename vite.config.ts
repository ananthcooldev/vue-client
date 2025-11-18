import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import removeConsole from 'vite-plugin-remove-console';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Remove console.* and debugger statements in production builds only
    removeConsole({
      includes: ['log', 'warn', 'debug', 'info'],
      external: ['error'], // Keep console.error for production error tracking
    }),
  ],
  server: {
    port: 5173,
    strictPort: false, // Try next available port if 5173 is busy, but prefer 5173
    host: 'localhost', // Listen only on localhost
    open: false, // Don't auto-open browser
    proxy: {
      '/api': {
        target: 'http://localhost:5280',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false, // Disable source maps in production (security & performance)
    minify: 'esbuild', // Minify for production
    cssMinify: true, // Minify CSS
    reportCompressedSize: false, // Disable compressed size reporting (faster builds)
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        // Remove comments and whitespace
        compact: true,
        // Optimize chunk splitting
        manualChunks: undefined,
      },
    },
  },
});
