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
    cors: true
  },
  define: {
    global: 'globalThis',
  }
});