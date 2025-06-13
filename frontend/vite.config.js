import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ mọi địa chỉ
    port: 5173,      // Đảm bảo chạy trên cổng 5127
    open: true,      // Mở trình duyệt tự động
    historyApiFallback: true, // Xử lý SPA route
  },
});