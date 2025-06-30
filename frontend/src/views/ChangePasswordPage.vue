<template>
  <div class="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-10 tw-px-4 sm:tw-px-6 lg:tw-px-8">
    <div class="tw-max-w-2xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-p-8">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Thay đổi mật khẩu</h2>

      <form class="tw-space-y-4">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu hiện tại</label>
          <div class="tw-relative">
            <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="form.currentPassword"
              type="password"
              placeholder="********"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu mới</label>
          <div class="tw-relative">
            <LockKeyhole class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="********"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Xác nhận mật khẩu mới</label>
          <div class="tw-relative">
            <ShieldCheck class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="********"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-end">
          <button
            type="submit"
            @click.prevent="handleChangePassword"
            class="tw-bg-[#086df9] tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-gap-2"
          >
            <Unlock class="tw-w-4 tw-h-4" /> Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, LockKeyhole, ShieldCheck, Unlock } from 'lucide-vue-next'

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleChangePassword = () => {
  if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
    alert('Vui lòng nhập đủ thông tin.')
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert('Mật khẩu xác nhận không trùng khớp.')
    return
  }
  alert('Mật khẩu đã được cập nhật thành công!')
}
</script>
