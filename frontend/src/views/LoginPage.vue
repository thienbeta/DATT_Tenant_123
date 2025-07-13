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
      <div class="shape3 tw-absolute tw-top-1/4 tw-right-1/4 tw-w-1/3 tw-h-1/3 tw-bg-pink-600/10 tw-rounded-lg tw-blur-2xl"></div>
    </div>

    <form
      @submit.prevent="handleLogin"
      class="tw-relative tw-z-10 tw-bg-white/10 tw-backdrop-blur-xl tw-p-8 tw-rounded-2xl tw-shadow-2xl tw-w-full tw-max-w-md"
      :style="formStyle"
    >
      <h2 
        class="tw-text-3xl tw-font-bold tw-mb-8 tw-text-center tw-text-white tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 100ms;"
      >Đăng nhập</h2>

      <div 
        class="tw-mb-4 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 200ms;"
      >
        <label class="tw-block tw-text-gray-300 tw-mb-1">Email</label>
        <div class="tw-relative">
          <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
          <input
            v-model="form.email"
            type="email"
            class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-py-2 tw-mt-1 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            placeholder="example@email.com"
            required
          />
        </div>
      </div>

      <div 
        class="tw-mb-6 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 300ms;"
      >
        <label class="tw-block tw-text-gray-300 tw-mb-1">Mật khẩu</label>
        <div class="tw-relative">
          <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-300" />
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="tw-w-full tw-bg-white/10 tw-border-2 tw-border-transparent hover:tw-border-purple-500/50 focus:tw-border-purple-500 tw-rounded-lg tw-px-10 tw-pr-10 tw-py-2 tw-mt-1 tw-text-white placeholder-gray-400 focus:tw-outline-none focus:tw-ring-0 tw-transition-all"
            placeholder="********"
            required
          />
          <Eye
            v-if="!showPassword"
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer hover:tw-text-white tw-transition-colors"
          />
          <EyeOff
            v-else
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer hover:tw-text-white tw-transition-colors"
          />
        </div>
      </div>

      <div 
        class="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 400ms;"
      >
        <label class="tw-flex tw-items-center tw-gap-2 tw-text-gray-300">
          <input v-model="form.remember" type="checkbox" class="tw-form-checkbox tw-rounded tw-text-purple-500 tw-bg-white/20 tw-border-none focus:tw-ring-purple-500" />
          Ghi nhớ đăng nhập
        </label>
        <RouterLink to="/forgot-password" class="tw-text-sm tw-text-purple-400 hover:underline">
          Quên mật khẩu?
        </RouterLink>
      </div>

      <div 
        v-if="error" 
        class="tw-text-red-400 tw-bg-red-500/20 tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-mb-4 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100': formVisible, 'opacity-0': !formVisible }"
        style="transition-delay: 450ms;"
      >{{ error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="shiny-button tw-relative tw-overflow-hidden tw-w-full tw-bg-gradient-to-r from-purple-600 to-blue-600 tw-text-white tw-font-semibold tw-py-3 tw-rounded-lg hover:from-purple-700 hover:to-blue-700 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-all tw-duration-300 hover:tw-scale-105 active:tw-scale-95 disabled:tw-opacity-60 disabled:tw-cursor-not-allowed"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 500ms;"
      >
        <template v-if="!loading">
          <LogIn class="tw-w-5 tw-h-5" /> Đăng nhập
        </template>
        <template v-else>
          <span class="tw-animate-spin mr-2">
            <svg class="tw-w-5 tw-h-5 tw-text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Đang xử lý...
        </template>
      </button>

      <p 
        class="tw-mt-8 tw-text-sm tw-text-center tw-text-gray-300 tw-transition-all tw-duration-500"
        :class="{ 'opacity-100 translate-y-0': formVisible, 'opacity-0 translate-y-5': !formVisible }"
        style="transition-delay: 600ms;"
      >
        Chưa có tài khoản?
        <RouterLink to="/register" class="tw-text-purple-400 hover:underline">Đăng ký</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-vue-next'
import { apiClient } from '../composables/useApiClient'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const formVisible = ref(false)
const mouse = reactive({ x: 0, y: 0 })

const handleMouseMove = (event: MouseEvent) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
}

const formStyle = computed(() => {
  if (typeof window === 'undefined') return {}
  const { innerWidth, innerHeight } = window
  const rotateX = (mouse.y / innerHeight - 0.5) * -25
  const rotateY = (mouse.x / innerWidth - 0.5) * 25
  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
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

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await apiClient.post(`/api/users/login`, {
      email: form.email,
      password: form.password
    })

    // Lưu token vào localStorage hoặc sessionStorage
    const storage = form.remember ? localStorage : sessionStorage
    storage.setItem('token', response.data.token)
    storage.setItem('user', JSON.stringify(response.data.user))

    // Chuyển hướng theo role
    if (response.data.user.role === 'tenant_user') {
      router.push('/tenant-user/dashboard').then(() => window.location.reload())
    } else {
      router.push('/').then(() => window.location.reload())
    }
  } catch (err) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Có lỗi xảy ra, vui lòng thử lại sau'
    }
  } finally {
    loading.value = false
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

.shape3 {
  animation: float 18s ease-in-out infinite alternate, spin 40s linear infinite;
  animation-delay: -3s;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  100% {
    transform: translateY(-40px) translateX(30px) rotate(20deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>