import { createRouter, createWebHistory } from 'vue-router'
import LayoutAdmin from '../layouts/LayoutAdmin.vue'
import HomePage from '../views/HomePage.vue'
import AboutPage from '../views/AboutPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import ChangePasswordPage from '../views/ChangePasswordPage.vue'
import TenantPage from '../views/TenantPage.vue'

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
    path: '/',
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'about', name: 'About', component: AboutPage },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: 'change-password', name: 'ChangePassword', component: ChangePasswordPage },
      { path: 'tenant', name: 'Tenant', component: TenantPage },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
