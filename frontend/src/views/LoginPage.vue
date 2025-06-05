<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 dark:tw-bg-gray-900">
    <form class="tw-bg-white dark:tw-bg-gray-800 tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Đăng nhập</h2>

      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
        <div class="tw-relative">
          <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
          <input
            type="email"
            class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 tw-mt-1 dark:tw-bg-gray-700 dark:tw-text-white"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu</label>
        <div class="tw-relative">
          <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
          <input
            :type="showPassword ? 'text' : 'password'"
            class="tw-w-full tw-border tw-rounded tw-px-10 tw-pr-10 tw-py-2 tw-mt-1 dark:tw-bg-gray-700 dark:tw-text-white"
            placeholder="********"
          />
          <Eye
            v-if="!showPassword"
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer"
          />
          <EyeOff
            v-else
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer"
          />
        </div>
      </div>

      <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <label class="tw-flex tw-items-center tw-gap-2 tw-text-gray-600 dark:tw-text-gray-300">
          <input type="checkbox" class="tw-form-checkbox tw-rounded tw-text-[#086df9]" />
          Ghi nhớ đăng nhập
        </label>
        <RouterLink to="/forgot-password" class="tw-text-sm tw-text-[#086df9] hover:underline">
          Quên mật khẩu?
        </RouterLink>
      </div>

      <button
        type="submit"
        class="tw-mt-2 tw-w-full tw-bg-[#086df9] tw-text-white tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-justify-center tw-gap-2"
      >
        <LogIn class="tw-w-4 tw-h-4" /> Đăng nhập
      </button>

      <p class="tw-mt-4 tw-text-sm dark:tw-text-gray-300">
        Chưa có tài khoản?
        <RouterLink to="/register" class="tw-text-[#086df9] hover:underline">Đăng ký</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-vue-next'

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>