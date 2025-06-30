import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    strictPort: true,
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    proxy: {
      '/api': {
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
});