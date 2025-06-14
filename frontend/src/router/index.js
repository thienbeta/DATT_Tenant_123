
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
import PaymentSuccess from '../views/PaymentSuccess.vue';
import AboutPage from '../views/AboutPage.vue'
import CategoryPage from '../views/CategoryPage.vue';

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
      { path: 'about', name: 'About', component: AboutPage },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: 'change-password', name: 'ChangePassword', component: ChangePasswordPage },
      { path: 'tenant', name: 'Tenant', component: TenantPage },
      { path: 'shop', name: 'Shop', component: Shop },
      { path: 'categories', name: 'Category', component: CategoryPage },
      { path: 'forgotpassword', name: 'Forgotpassword', component: ForgotPasswordPage },
      { path: 'package', name: 'Package', component: PackagePage },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;