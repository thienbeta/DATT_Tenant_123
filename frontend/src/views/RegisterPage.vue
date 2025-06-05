<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 dark:tw-bg-gray-900">
    <form class="tw-bg-white dark:tw-bg-gray-800 tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Đăng ký</h2>

      <div class="tw-space-y-4">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Họ và tên</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Nguyễn Văn A"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="********"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Nhập lại mật khẩu</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="********"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <button
          type="submit"
          @click.prevent="handleSubmit"
          class="tw-mt-4 tw-w-full tw-bg-[#086df9] tw-text-white tw-py-2 tw-rounded hover:tw-bg-blue-700"
        >
          Đăng ký
        </button>

        <p class="tw-mt-4 tw-text-sm dark:tw-text-gray-300">
          Đã có tài khoản?
          <RouterLink to="/login" class="tw-text-[#086df9] hover:underline">Đăng nhập</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    alert('Vui lòng điền đầy đủ thông tin.')
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    alert('Mật khẩu không trùng khớp.')
    return
  }
  // Gửi thông tin đăng ký đến API tại đây...
  alert('Đăng ký thành công!')
  router.push('/login')
}
</script>
