import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './tailwind.css'
import App from './App.vue'
import router from './router';
import 'vue3-toastify/dist/index.css';
import { reportBandwidthUsage } from './utils/bandwidthReporter';

const app = createApp(App);
app.use(router,Vue3Toastify, {
  autoClose: 5000,
  theme: 'colored',
  position: 'top-right',
});

// Chỉ gọi bandwidth reporter một lần khi app khởi động
const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const packageId = user && user.package_id ? user.package_id : null;

// Chỉ gọi nếu user đã login và có package, không phải global_admin
if (user && packageId && user.role !== 'global_admin' && user.tenant_id && user.user_id) {
  // Delay để đảm bảo app đã mount xong
  setTimeout(() => {
    reportBandwidthUsage(user, packageId);
  }, 1000);
}

app.mount('#app');
