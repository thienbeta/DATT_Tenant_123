<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý Dữ liệu Dịch vụ</h1>
            <p class="mt-2 text-gray-600">Theo dõi và quản lý dữ liệu sử dụng dịch vụ của doanh nghiệp</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-4 sm:px-0">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="mt-6">
        <!-- Danh sách dữ liệu -->
        <div v-if="activeTab === 'list'" class="px-4 sm:px-0">
          <tableServiceData />
        </div>

        <!-- Thống kê -->
        <div v-else-if="activeTab === 'stats'" class="px-4 sm:px-0">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Thống kê theo tenant -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thống kê theo Gói dịch vụ</h3>
              <div v-if="tenantStatsLoading" class="text-center py-4">
                <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tải thống kê...
                </div>
              </div>
              <div v-else-if="tenantStatsError" class="text-center py-4">
                <p class="text-red-600">{{ tenantStatsError }}</p>
                <button @click="loadTenantStats" class="mt-2 text-blue-600 hover:text-blue-800">Thử lại</button>
              </div>
              <div v-else class="space-y-4">
                <div v-for="stat in tenantStats" :key="stat.package_id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ stat.package?.name }}</h4>
                      <p class="text-sm text-gray-500">Giới hạn: {{ formatFileSize(stat.package?.file_storage_limit || 0) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">{{ formatFileSize(stat.total_file_size) }}</p>
                      <p class="text-xs text-gray-500">Đã sử dụng</p>
                    </div>
                  </div>
                  <div class="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p class="text-gray-500">Băng thông</p>
                      <p class="font-medium">{{ formatBandwidth(stat.total_bandwidth) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Database</p>
                      <p class="font-medium">{{ formatFileSize(stat.total_database) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">API Calls</p>
                      <p class="font-medium">{{ stat.total_api_calls.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thống kê theo user -->
            <div class="bg-white shadow rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thống kê theo Người dùng</h3>
              <div v-if="userStatsLoading" class="text-center py-4">
                <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tải thống kê...
                </div>
              </div>
              <div v-else-if="userStatsError" class="text-center py-4">
                <p class="text-red-600">{{ userStatsError }}</p>
                <button @click="loadUserStats" class="mt-2 text-blue-600 hover:text-blue-800">Thử lại</button>
              </div>
              <div v-else class="space-y-4">
                <div v-for="stat in userStats" :key="stat.package_id" class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ stat.package?.name }}</h4>
                      <p class="text-sm text-gray-500">Giới hạn: {{ formatFileSize(stat.package?.file_storage_limit || 0) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-medium text-gray-900">{{ formatFileSize(stat.total_file_size) }}</p>
                      <p class="text-xs text-gray-500">Đã sử dụng</p>
                    </div>
                  </div>
                  <div class="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p class="text-gray-500">Băng thông</p>
                      <p class="font-medium">{{ formatBandwidth(stat.total_bandwidth) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Database</p>
                      <p class="font-medium">{{ formatFileSize(stat.total_database) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">API Calls</p>
                      <p class="font-medium">{{ stat.total_api_calls.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kiểm tra giới hạn -->
        <div v-else-if="activeTab === 'limits'" class="px-4 sm:px-0">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Kiểm tra Giới hạn Sử dụng</h3>
            <form @submit.prevent="checkLimits" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
                  <select v-model="limitCheck.user_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn người dùng</option>
                    <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                      {{ user.email }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Gói dịch vụ</label>
                  <select v-model="limitCheck.package_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn gói dịch vụ</option>
                    <option v-for="pkg in packages" :key="pkg.package_id" :value="pkg.package_id">
                      {{ pkg.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dung lượng cần thêm (bytes)</label>
                  <input
                    v-model="limitCheck.file_size"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="limitCheckLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <svg v-if="limitCheckLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kiểm tra
                </button>
              </div>
            </form>

            <!-- Kết quả kiểm tra -->
            <div v-if="limitCheckResult" class="mt-6 border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">Kết quả kiểm tra</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Gói dịch vụ</p>
                  <p class="font-medium">{{ limitCheckResult.package.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Giới hạn</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.package.file_storage_limit) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Đã sử dụng</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.current) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Yêu cầu thêm</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.requested) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tổng cộng</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.total) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Còn lại</p>
                  <p class="font-medium">{{ limitCheckResult.usage.remaining > 0 ? formatFileSize(limitCheckResult.usage.remaining) : 'Không giới hạn' }}</p>
                </div>
              </div>
              <div class="mt-4">
                <span :class="limitCheckResult.isWithinLimit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ limitCheckResult.isWithinLimit ? '✓ Trong giới hạn' : '✗ Vượt quá giới hạn' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useServiceData } from '../composables/useServiceData'
import tableServiceData from '../components/tableServiceData.vue'

const {
  loading,
  fetchServiceData,
  fetchTenantStats,
  fetchUserStats,
  checkUsageLimits,
  formatFileSize,
  formatBandwidth
} = useServiceData()

// State
const activeTab = ref('list')
const tenantStats = ref([])
const userStats = ref([])
const tenantStatsLoading = ref(false)
const userStatsLoading = ref(false)
const tenantStatsError = ref(null)
const userStatsError = ref(null)
const limitCheckLoading = ref(false)
const limitCheckResult = ref(null)
const packages = ref([])
const users = ref([])

// Tabs
const tabs = [
  { id: 'list', name: 'Danh sách dữ liệu' },
  { id: 'stats', name: 'Thống kê' },
  { id: 'limits', name: 'Kiểm tra giới hạn' }
]

// Limit check form
const limitCheck = reactive({
  user_id: '',
  package_id: '',
  file_size: 0
})

// Methods
const refreshData = async () => {
  if (activeTab.value === 'list') {
    await fetchServiceData()
  } else if (activeTab.value === 'stats') {
    await loadTenantStats()
    await loadUserStats()
  }
}

const loadTenantStats = async () => {
  tenantStatsLoading.value = true
  tenantStatsError.value = null
  try {
    const data = await fetchTenantStats()
    tenantStats.value = data
  } catch (err) {
    tenantStatsError.value = err.message
  } finally {
    tenantStatsLoading.value = false
  }
}

const loadUserStats = async () => {
  userStatsLoading.value = true
  userStatsError.value = null
  try {
    const data = await fetchUserStats()
    userStats.value = data
  } catch (err) {
    userStatsError.value = err.message
  } finally {
    userStatsLoading.value = false
  }
}

const checkLimits = async () => {
  limitCheckLoading.value = true
  limitCheckResult.value = null
  try {
    const result = await checkUsageLimits(limitCheck)
    limitCheckResult.value = result
  } catch (err) {
    console.error('Error checking limits:', err)
  } finally {
    limitCheckLoading.value = false
  }
}

// Watch for tab changes
const watchTab = (newTab) => {
  if (newTab === 'stats') {
    loadTenantStats()
    loadUserStats()
  }
}

// Load initial data
onMounted(async () => {
  // TODO: Load packages and users data
  // This would typically come from other composables or API calls
})
</script> 