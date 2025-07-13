<template>
  <div
    class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br from-gray-900 to-black tw-font-sans tw-overflow-hidden tw-relative"
    @mousemove="handleMouseMove"
  >
    <!-- Spotlight Effect -->
    <div class="spotlight" :style="spotlightStyle"></div>

    <!-- Decorative Blobs -->
    <div class="tw-absolute tw-inset-0 tw-pointer-events-none">
      <div class="shape1 tw-absolute -tw-top-1/4 -tw-left-1/4 tw-w-1/2 tw-h-1/2 tw-bg-purple-600/20 tw-rounded-full tw-blur-3xl"></div>
      <div class="shape2 tw-absolute -tw-bottom-1/4 -tw-right-1/4 tw-w-1/2 tw-h-1/2 tw-bg-blue-600/20 tw-rounded-full tw-blur-3xl"></div>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="tw-relative tw-z-10 tw-bg-white/10 tw-backdrop-blur-xl tw-p-8 tw-rounded-2xl tw-shadow-2xl tw-w-full tw-max-w-md"
      :style="formStyle"
    >
      <h2
        class="tw-text-3xl tw-font-bold tw-mb-8 tw-text-center tw-text-white tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 100ms;"
      >Khôi phục mật khẩu</h2>

      <div
        v-if="error"
        class="tw-text-red-400 tw-bg-red-500/20 tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-mb-4 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100': formVisible, 'opacity-0': !formVisible }"
        style="transition-delay: 150ms;"
      >{{ error }}</div>
      <div
        v-if="success"
        class="tw-text-green-300 tw-bg-green-500/20 tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-mb-4 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100': formVisible, 'opacity-0': !formVisible }"
        style="transition-delay: 150ms;"
      >{{ success }}</div>

      <div class="tw-space-y-4">
        <div
          class="tw-transition-all tw-duration-500"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
          style="transition-delay: 200ms;"
        >
          <label class="tw-block tw-text-gray-300 tw-mb-1">Email</label>
          <div class="tw-relative">
            <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
            <input
              v-model="email"
              type="email"
              placeholder="example@email.com"
              required
              class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-py-2 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            />
          </div>
          <button
            type="button"
            @click="sendOtp"
            :disabled="loading.otp"
            class="tw-mt-2 tw-w-full tw-bg-white/10 hover:tw-bg-white/20 tw-text-white tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-gap-2 disabled:tw-opacity-50 tw-transition-all"
          >
            <template v-if="loading.otp">
              <span class="tw-animate-spin">⌛</span> Đang gửi...
            </template>
            <template v-else>
              <Key class="tw-w-4 tw-h-4" /> Gửi mã OTP
            </template>
          </button>
        </div>

        <div
          class="tw-transition-all tw-duration-500"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
          style="transition-delay: 300ms;"
        >
          <label class="tw-block tw-text-gray-300 tw-mb-1">Mã OTP</label>
          <div class="tw-relative">
            <Key class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
            <input
              v-model="otp"
              type="text"
              placeholder="Nhập mã OTP"
              required
              class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-py-2 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            />
          </div>
        </div>

        <div
          class="tw-transition-all tw-duration-500"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
          style="transition-delay: 400ms;"
        >
          <label class="tw-block tw-text-gray-300 tw-mb-1">Mật khẩu mới</label>
          <div class="tw-relative">
            <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
            <input
              v-model="newPassword"
              type="password"
              placeholder="********"
              required
              class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-py-2 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            />
          </div>
        </div>

        <div
          class="tw-transition-all tw-duration-500"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
          style="transition-delay: 500ms;"
        >
          <label class="tw-block tw-text-gray-300 tw-mb-1">Xác nhận mật khẩu</label>
          <div class="tw-relative">
            <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="********"
              required
              class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-py-2 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading.submit"
          class="shiny-button tw-relative tw-overflow-hidden tw-mt-4 tw-w-full tw-bg-gradient-to-r from-purple-600 to-blue-600 tw-text-white tw-font-semibold tw-py-3 tw-rounded-lg hover:from-purple-700 hover:to-blue-700 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-all tw-duration-300 hover:tw-scale-105 active:tw-scale-95 disabled:tw-opacity-60 disabled:tw-cursor-not-allowed"
          style="transition-delay: 600ms;"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        >
           <template v-if="loading.submit">
              <span class="tw-animate-spin">⌛</span> Đang xử lý...
            </template>
            <template v-else>
              <RefreshCcw class="tw-w-4 tw-h-4" /> Khôi phục mật khẩu
            </template>
        </button>

        <p
          class="tw-mt-4 tw-text-sm tw-text-center tw-text-gray-300"
          :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
          style="transition-delay: 700ms;"
        >
          Quay lại
          <RouterLink to="/login" class="tw-text-purple-400 hover:underline"> Đăng nhập</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { Mail, Lock, RefreshCcw, Key } from 'lucide-vue-next'
import { apiClient } from '../composables/useApiClient'
import { useRouter } from 'vue-router'

const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const loading = ref({ otp: false, submit: false })
const error = ref('')
const success = ref('')
const formVisible = ref(false)
const mouse = reactive({ x: 0, y: 0 })

const router = useRouter()

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

const formStyle = computed(() => {
  if (typeof window === 'undefined') return {}
  const { innerWidth, innerHeight } = window
  const rotateX = (mouse.y / innerHeight - 0.5) * -15 // Reduced rotation for less drastic effect
  const rotateY = (mouse.x / innerWidth - 0.5) * 15
  return {
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
    transition: 'transform 0.2s ease-out'
  }
})

const spotlightStyle = computed(() => {
  return {
    left: `${mouse.x}px`,
    top: `${mouse.y}px`,
  }
})

onMounted(() => {
  setTimeout(() => {
    formVisible.value = true
  }, 100)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

const handleSubmit = async () => {
  if (!email.value || !otp.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Vui lòng điền đủ thông tin.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không trùng khớp.'
    return
  }
  
  loading.value.submit = true
  error.value = ''
  success.value = ''

  try {
    const response = await apiClient.post('/api/users/reset-password', {
      email: email.value,
      otp: otp.value,
      newPassword: newPassword.value
    });
    success.value = response.data.message + " Bạn sẽ được chuyển hướng về trang đăng nhập sau 3 giây.";
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Có lỗi xảy ra khi khôi phục mật khẩu.'
  } finally {
    loading.value.submit = false
  }
}

const sendOtp = async () => {
  if (!email.value) {
    error.value = 'Vui lòng nhập email trước khi gửi mã OTP.'
    return
  }

  loading.value.otp = true
  error.value = ''
  success.value = ''

  try {
    const response = await apiClient.post('/api/users/forgot-password', { email: email.value });
    success.value = response.data.message;
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Có lỗi xảy ra khi gửi OTP.'
  } finally {
    loading.value.otp = false
  }
}
</script>

<style scoped>
.spotlight {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.1) 0%, rgba(192, 132, 252, 0) 60%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out;
}

.shiny-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.shiny-button:hover::before {
  left: 150%;
}

.shape1, .shape2, .shape3 {
  animation: float 20s ease-in-out infinite alternate;
}

.shape2 {
  animation-duration: 25s;
  animation-delay: -5s;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  100% {
    transform: translateY(-40px) translateX(30px);
  }
}
</style>
