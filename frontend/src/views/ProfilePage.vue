<template>
  <div class="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-10 tw-px-4 sm:tw-px-6 lg:tw-px-8">
    <div class="tw-max-w-2xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-p-8">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Hồ sơ cá nhân</h2>

      <form class="tw-space-y-4" @submit.prevent="handleSave">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Họ và tên</label>
          <div class="tw-relative">
            <User class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.full_name"
              type="text"
              required
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
              disabled
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 tw-bg-gray-100 dark:tw-bg-gray-600 dark:tw-text-gray-300"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Số điện thoại</label>
          <div class="tw-relative">
            <Phone class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.phone_number"
              type="text"
              required
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-text-sm tw-text-red-500" v-if="error">
            {{ error }}
          </div>
          <div class="tw-text-sm tw-text-green-500" v-if="success">
            {{ success }}
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="tw-bg-[#086df9] tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-gap-2 disabled:tw-opacity-50"
          >
            <template v-if="!loading">
              <Save class="tw-w-4 tw-h-4" /> Lưu thay đổi
            </template>
            <template v-else>
              <span class="tw-animate-spin">⌛</span> Đang xử lý...
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Mail, Phone, Save } from 'lucide-vue-next'
import axios from 'axios'

const profile = ref({
  full_name: '',
  email: '',
  phone_number: ''
})

onMounted(() => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    profile.value = {
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone  // Đổi thành phone_number
    }
  }
})

const handleSave = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await axios.put(
      '/api/users/profile',  // URL này sẽ được proxy chuyển tiếp đến backend
      {
        full_name: profile.value.full_name,
        phone_number: profile.value.phone_number
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Cập nhật thông tin user trong storage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      user.full_name = response.data.user.full_name
      user.phone_number = response.data.user.phone_number
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        sessionStorage.setItem('user', JSON.stringify(user))
      }
    }

    success.value = 'Cập nhật thông tin thành công'
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin'
    console.error('Error updating profile:', err)
  } finally {
    loading.value = false
  }
}
</script>