import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import ChangePasswordPage from '../views/ChangePasswordPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import TenantPage from '../views/TenantPage.vue'
import PackagePage from '../views/PackagePage.vue'
import Shop from '../views/Shop.vue'
import { Package } from 'lucide-vue-next'
import CategoryPage from '../views/CategoryPage.vue'
import CustomerPage from '../views/CustomerPage.vue'
import ServiceDataPage from '../views/ServiceDataPage.vue'
import TenantUserDashboard from '../views/TenantUserDashboard.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue';
import AboutPage from '../views/AboutPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { layout: 'none' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { layout: 'none' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage,
    meta: { layout: 'none' }
  },
  {
  path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  
  {
    path: '/',
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'dashboard', name: 'Dashboard', component: HomePage },
      { path: 'about', name: 'About', component: AboutPage },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: 'change-password', name: 'ChangePassword', component: ChangePasswordPage },
      { path: 'tenant', name: 'Tenant', component: TenantPage },
      { path: 'shop', name: 'Shop', component: Shop },
      { path: 'categories', name: 'Category', component: CategoryPage },
      { path: 'customers', name: 'Customer', component: CustomerPage },
      { path: 'service-data', name: 'ServiceData', component: ServiceDataPage },
      { path: 'orders', name: 'Orders', component: HomePage },
      { path: 'inventory', name: 'Inventory', component: HomePage },
      { path: 'promotions', name: 'Promotions', component: HomePage },
      { path: 'reports', name: 'Reports', component: HomePage },
      { path: 'settings', name: 'Settings', component: HomePage },
      { path: 'logout', name: 'Logout', component: HomePage },
      { path: 'privacy-policy', name: 'PrivacyPolicy', component: HomePage },
      { path: 'terms', name: 'Terms', component: HomePage }
    ]
  },
  {
    path: '/tenant-user',
    children: [
      { path: 'dashboard', name: 'TenantUserDashboard', component: TenantUserDashboard },
      { path: 'files', name: 'TenantUserFiles', component: HomePage },
      { path: 'databases', name: 'TenantUserDatabases', component: HomePage },
      { path: 'domains', name: 'TenantUserDomains', component: HomePage },
      { path: 'profile', name: 'TenantUserProfile', component: ProfilePage },
      { path: 'forgotpassword', name: 'Forgotpassword', component: ForgotPasswordPage },
      { path: 'package', name: 'Package', component: PackagePage },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard cho tenant_user và tenant_admin
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  // Xử lý logout
  if (to.path === '/logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user') 
    return next('/login')
  }

  // Các route cho phép truy cập mà không cần đăng nhập
  const publicRoutes = [
    '/login', '/register', '/forgot-password', '/logout'
  ]

  // Các route yêu cầu đăng nhập
  const protectedRoutes = [
    '/profile', '/change-password', '/tenant', '/categories', 
    '/customers', '/service-data', '/orders', '/inventory', '/promotions', 
    '/reports', '/settings', '/privacy-policy', '/terms'
  ]

  // Các route chỉ cho phép tenant_admin và global_admin
  const adminOnlyRoutes = [
    '/shop'
  ]

  // Kiểm tra nếu route yêu cầu đăng nhập nhưng user chưa đăng nhập
  if ((protectedRoutes.includes(to.path) || adminOnlyRoutes.includes(to.path)) && (!user || !token)) {
    return next('/login')
  }

  // Kiểm tra quyền truy cập Shop - chỉ cho phép tenant_admin và global_admin
  if (adminOnlyRoutes.includes(to.path)) {
    if (!user || (user.role !== 'tenant_admin' && user.role !== 'global_admin')) {
      return next('/') // Redirect về home nếu không có quyền
    }
  }

  // Các route cho phép tenant_user truy cập
  const allowedTenantUserRoutes = [
    '/login', '/register', '/forgot-password', '/logout'
  ]

  // Xử lý tenant_user - chỉ cho phép truy cập /tenant-user routes
  if (user && user.role === 'tenant_user') {
    if (!to.path.startsWith('/tenant-user') && !allowedTenantUserRoutes.includes(to.path)) {
      return next('/tenant-user/dashboard')
    }
  }

  // Xử lý tenant_admin - cho phép truy cập tất cả routes trừ /tenant-user
  if (user && user.role === 'tenant_admin') {
    if (to.path.startsWith('/tenant-user')) {
      return next('/') // Redirect về home nếu cố truy cập tenant-user routes
    }
  }

  next()
})

export default router
