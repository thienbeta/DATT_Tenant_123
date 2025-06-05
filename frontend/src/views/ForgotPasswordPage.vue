<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 dark:tw-bg-gray-900">
    <form class="tw-bg-white dark:tw-bg-gray-800 tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Khôi phục mật khẩu</h2>

      <div class="tw-space-y-4">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
          <div class="tw-relative">
            <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="email"
              type="email"
              placeholder="example@email.com"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
          <button
            type="button"
            @click="sendOtp"
            class="tw-mt-2 tw-w-full tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-700 dark:tw-text-white tw-py-2 tw-rounded hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600 tw-flex tw-items-center tw-justify-center tw-gap-2"
          >
            <Key class="tw-w-4 tw-h-4" /> Gửi mã OTP
          </button>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mã OTP</label>
          <div class="tw-relative">
            <Key class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="otp"
              type="text"
              placeholder="Nhập mã OTP"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu mới</label>
          <div class="tw-relative">
            <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="newPassword"
              type="password"
              placeholder="********"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Xác nhận mật khẩu</label>
          <div class="tw-relative">
            <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="********"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          @click.prevent="handleSubmit"
          class="tw-mt-4 tw-w-full tw-bg-[#086df9] tw-text-white tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-justify-center tw-gap-2"
        >
          <RefreshCcw class="tw-w-4 tw-h-4" /> Khôi phục mật khẩu
        </button>

        <p class="tw-mt-4 tw-text-sm dark:tw-text-gray-300">
          Quay lại
          <RouterLink to="/login" class="tw-text-[#086df9] hover:underline"> Đăng nhập</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Lock, RefreshCcw, Key } from 'lucide-vue-next'

const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handleSubmit = () => {
  if (!email.value || !otp.value || !newPassword.value || !confirmPassword.value) {
    alert('Vui lòng điền đủ thông tin.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('Mật khẩu xác nhận không trùng khớp.')
    return
  }
  alert(`Khởi phục mật khẩu cho: ${email.value}`)
}

const sendOtp = () => {
  if (!email.value) {
    alert('Vui lòng nhập email trước khi gửi mã OTP.')
    return
  }
  alert(`Đã gửi OTP tới email: ${email.value}`)
}
</script>
