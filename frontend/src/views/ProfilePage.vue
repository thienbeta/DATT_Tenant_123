<template>
  <div class="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-10 tw-px-4 sm:tw-px-6 lg:tw-px-8">
    <div class="tw-max-w-2xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-p-8">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Hồ sơ cá nhân</h2>

      <form class="tw-space-y-4">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Họ và tên</label>
          <div class="tw-relative">
            <User class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.name"
              type="text"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
          <div class="tw-relative">
            <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.email"
              type="email"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Số điện thoại</label>
          <div class="tw-relative">
            <Phone class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.phone"
              type="text"
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-end">
          <button
            type="submit"
            @click.prevent="handleSave"
            class="tw-bg-[#086df9] tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-gap-2"
          >
            <Save class="tw-w-4 tw-h-4" /> Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Phone, Save } from 'lucide-vue-next'

const profile = ref({
  name: 'Nguyễn Văn A',
  email: 'example@email.com',
  phone: '0901234567'
})

const handleSave = () => {
  // Gỏi API cập nhật hồ sơ tại đây...
  alert('Cập nhật thành công!')
}
</script>