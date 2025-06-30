<template>
  <div class="tw-flex tw-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <!-- Sidebar -->
    <aside class="tw-w-64 tw-bg-white tw-border-r tw-shadow-sm tw-h-screen tw-flex tw-flex-col">
      <div class="tw-p-4">
        <RouterLink to="/tenant" class="tw-flex tw-justify-center">
          <img src="/logo.jpg" alt="Logo" class="tw-h-14 tw-w-full tw-object-contain" />
        </RouterLink>
      </div>
      <nav class="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-px-4">
        <RouterLink to="/tenant" :class="navClass('/tenant')">
          <FolderKanban class="tw-w-4 tw-h-4 tw-text-yellow-500" /> Tenant
        </RouterLink>
        <RouterLink to="/tenant/purchases" :class="navClass('/tenant/purchases')">
          <Receipt class="tw-w-4 tw-h-4 tw-text-red-500" /> Lịch sử mua hàng
        </RouterLink>
        <RouterLink to="/tenant/shop" :class="navClass('/tenant/shop')">
          <Store class="tw-w-4 tw-h-4 tw-text-blue-500" /> Cửa hàng
        </RouterLink>
        <RouterLink to="/tenant/shop-admin" :class="navClass('/tenant/shop-admin')">
          <Store class="tw-w-4 tw-h-4 tw-text-green-600" /> Quản lý file
        </RouterLink>
        <RouterLink to="/tenant/nick" :class="navClass('/tenant/shop-admin')">
          <Store class="tw-w-4 tw-h-4 tw-text-green-600" /> Quản lý hình ảnh 
        </RouterLink>
      </nav>
      <div class="tw-px-4 tw-py-3 tw-border-t tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-gap-4">
        <RouterLink
          to="/profile"
          :class="[
            'tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent hover:tw-border-[#086df9] hover:tw-text-[#086df9]',
            route.path === '/profile' ? 'tw-border-[#086df9] tw-text-[#086df9]' : 'tw-text-gray-500'
          ]"
        >
          <User class="tw-w-4 tw-h-4 tw-text-gray-500" /> Tài khoản
        </RouterLink>
        <a @click.prevent="handleLogout"
          class="tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent hover:tw-border-red-600 hover:tw-text-red-600 tw-text-gray-500 tw-cursor-pointer"
        >
          <LogOut class="tw-w-4 tw-h-4 tw-text-gray-500" /> Đăng xuất
        </a>
      </div>
    </aside>

    <!-- Nội dung -->
    <div class="tw-flex-1 tw-flex tw-flex-col">
      <header
        class="tw-sticky tw-top-0 tw-z-50 tw-h-16 tw-flex tw-items-center tw-justify-between tw-px-6 tw-border-b tw-bg-white dark:tw-bg-gray-800 dark:tw-border-gray-700"
      >
        <div class="tw-flex tw-items-center tw-gap-4">
          <div class="tw-relative tw-w-64">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              class="tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-800 dark:tw-text-gray-100 tw-rounded-md tw-px-4 tw-py-1 focus:tw-outline-none focus:tw-ring focus:tw-ring-[#086df9]/40"
            />
            <Search class="tw-w-4 tw-h-4 tw-absolute tw-top-2 tw-right-3 tw-text-gray-400" />
          </div>
        </div>
        <div class="tw-relative tw-flex tw-items-center tw-gap-4">
           <div class="tw-relative" @click="toggleDropdown">
            <User
              class="tw-w-7 tw-h-7 tw-text-gray-700 dark:tw-text-gray-200 tw-cursor-pointer hover:tw-text-[#086df9]"
            />
            <div
              v-if="dropdownOpen"
              class="tw-absolute tw-right-0 tw-mt-2 tw-w-48 tw-bg-white dark:tw-bg-gray-800 tw-rounded-md tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-z-50"
            >
              <div class="tw-px-4 tw-py-2 tw-border-b dark:tw-border-gray-600 tw-font-semibold dark:tw-text-white">
                Xin chào, {{ userInfo.full_name }}
              </div>
              <RouterLink
                to="/profile"
                class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-200"
              >
                <User class="tw-w-4 tw-h-4" /> Hồ sơ
              </RouterLink>
              <RouterLink
                to="/change-password"
                class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-200"
              >
                <Settings class="tw-w-4 tw-h-4" /> Đổi mật khẩu
              </RouterLink>
              <a href="#" @click.prevent="handleLogout" class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-red-600 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-cursor-pointer">
                <LogOut class="tw-w-4 tw-h-4" /> Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </header>
       <main class="tw-flex-1 tw-overflow-y-auto tw-p-4 dark:tw-text-white">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import {
  FolderKanban,
  Receipt,
  Store,
  Settings,
  User,
  LogOut,
  Search,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const dropdownOpen = ref(false)

const userInfo = computed(() => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : {}
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  dropdownOpen.value = false
  router.push('/login')
}

const navClass = (path: string) => {
  const base = 'tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-transition-colors'
  const active = 'tw-border-[#086df9] tw-text-[#086df9]'
  const inactive = 'tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]'
  // Use startsWith for parent routes
  return [base, route.path.startsWith(path) && path !== '/tenant' || route.path === path ? active : inactive]
}
</script>