<template>
  <div v-if="show" class="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-z-50">
    <div class="tw-relative tw-top-10 tw-mx-auto tw-p-5 tw-border tw-w-11/12 tw-max-w-4xl tw-shadow-lg tw-rounded-md tw-bg-white dark:tw-bg-gray-800">
      <div class="tw-mt-3">
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h3 class="tw-text-xl tw-font-semibold tw-text-gray-900 dark:tw-text-white">
            Chi tiết dung lượng sử dụng
          </h3>
          <button
            @click="$emit('close')"
            class="tw-text-gray-400 hover:tw-text-gray-600 dark:hover:tw-text-gray-300"
          >
            <X class="tw-w-6 tw-h-6" />
          </button>
        </div>

        <!-- User Info -->
        <div class="tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg tw-p-4 tw-mb-6">
          <h4 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white tw-mb-3">Thông tin người dùng</h4>
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Tên:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ userInfo?.full_name || 'N/A' }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Email:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ userInfo?.email || 'N/A' }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Gói dịch vụ:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ packageInfo?.name || 'N/A' }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Tenant:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ tenantInfo?.name || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Usage Statistics -->
        <div v-if="loading" class="tw-text-center tw-py-8">
          <Loader2 class="tw-w-8 tw-h-8 tw-animate-spin tw-mx-auto tw-mb-4" />
          <p class="tw-text-gray-600 dark:tw-text-gray-400">Đang tải thống kê...</p>
        </div>

        <div v-else-if="usageStats">
          <h4 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white tw-mb-4">Thống kê sử dụng</h4>
          
          <!-- Usage Cards -->
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6">
            <div class="tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-rounded-lg tw-p-4">
              <div class="tw-flex tw-items-center">
                <HardDrive class="tw-w-8 tw-h-8 tw-text-blue-600 dark:tw-text-blue-400" />
                <div class="tw-ml-3">
                  <p class="tw-text-sm tw-font-medium tw-text-blue-600 dark:tw-text-blue-400">Dung lượng file</p>
                  <p class="tw-text-lg tw-font-semibold tw-text-blue-900 dark:tw-text-blue-100">
                    {{ formatStorage(usageStats.totalFileSize) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="tw-bg-green-50 dark:tw-bg-green-900/20 tw-rounded-lg tw-p-4">
              <div class="tw-flex tw-items-center">
                <Activity class="tw-w-8 tw-h-8 tw-text-green-600 dark:tw-text-green-400" />
                <div class="tw-ml-3">
                  <p class="tw-text-sm tw-font-medium tw-text-green-600 dark:tw-text-green-400">Bandwidth</p>
                  <p class="tw-text-lg tw-font-semibold tw-text-green-900 dark:tw-text-green-100">
                    {{ formatStorage(usageStats.totalBandwidth) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="tw-bg-purple-50 dark:tw-bg-purple-900/20 tw-rounded-lg tw-p-4">
              <div class="tw-flex tw-items-center">
                <Database class="tw-w-8 tw-h-8 tw-text-purple-600 dark:tw-text-purple-400" />
                <div class="tw-ml-3">
                  <p class="tw-text-sm tw-font-medium tw-text-purple-600 dark:tw-text-purple-400">Database</p>
                  <p class="tw-text-lg tw-font-semibold tw-text-purple-900 dark:tw-text-purple-100">
                    {{ formatStorage(usageStats.totalDatabase) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="tw-bg-orange-50 dark:tw-bg-orange-900/20 tw-rounded-lg tw-p-4">
              <div class="tw-flex tw-items-center">
                <FileText class="tw-w-8 tw-h-8 tw-text-orange-600 dark:tw-text-orange-400" />
                <div class="tw-ml-3">
                  <p class="tw-text-sm tw-font-medium tw-text-orange-600 dark:tw-text-orange-400">Số file</p>
                  <p class="tw-text-lg tw-font-semibold tw-text-orange-900 dark:tw-text-orange-100">
                    {{ usageStats.totalFiles }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- API Calls -->
          <div class="tw-bg-yellow-50 dark:tw-bg-yellow-900/20 tw-rounded-lg tw-p-4 tw-mb-6">
            <div class="tw-flex tw-items-center">
              <Zap class="tw-w-6 tw-h-6 tw-text-yellow-600 dark:tw-text-yellow-400" />
              <div class="tw-ml-3">
                <p class="tw-text-sm tw-font-medium tw-text-yellow-600 dark:tw-text-yellow-400">API Calls đã sử dụng</p>
                <p class="tw-text-lg tw-font-semibold tw-text-yellow-900 dark:tw-text-yellow-100">
                  {{ usageStats.totalApiCalls.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Daily Chart -->
          <div v-if="usageStats.dailyStats.length > 0" class="tw-mb-6">
            <h5 class="tw-text-md tw-font-medium tw-text-gray-900 dark:tw-text-white tw-mb-3">Thống kê 7 ngày gần nhất</h5>
            <div class="tw-bg-white dark:tw-bg-gray-700 tw-rounded-lg tw-p-4 tw-border dark:tw-border-gray-600">
              <div class="tw-flex tw-items-end tw-space-x-2 tw-h-32">
                <div
                  v-for="stat in usageStats.dailyStats"
                  :key="stat.date"
                  class="tw-flex-1 tw-flex tw-flex-col tw-items-center"
                >
                  <div
                    class="tw-bg-blue-500 tw-rounded-t tw-transition-all tw-duration-300 hover:tw-bg-blue-600"
                    :style="{ height: `${Math.max((stat.totalSize / maxDailySize) * 100, 5)}%` }"
                    :title="`${formatStorage(stat.totalSize)} - ${stat.fileCount} files`"
                  ></div>
                  <span class="tw-text-xs tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2">
                    {{ formatDate(stat.date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- File List -->
          <div>
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h5 class="tw-text-md tw-font-medium tw-text-gray-900 dark:tw-text-white">Danh sách file gần đây</h5>
              <button
                @click="loadUserFiles"
                class="tw-text-sm tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-300"
              >
                Xem tất cả
              </button>
            </div>
            
            <div v-if="filesLoading" class="tw-text-center tw-py-4">
              <Loader2 class="tw-w-6 tw-h-6 tw-animate-spin tw-mx-auto" />
            </div>
            
            <div v-else-if="userFiles.length === 0" class="tw-text-center tw-py-8 tw-text-gray-500 dark:tw-text-gray-400">
              Chưa có file nào được upload
            </div>
            
            <div v-else class="tw-space-y-2 tw-max-h-64 tw-overflow-y-auto">
              <div
                v-for="file in userFiles.slice(0, 5)"
                :key="file.data_id"
                class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg"
              >
                <div class="tw-flex tw-items-center tw-space-x-3">
                  <File class="tw-w-5 tw-h-5 tw-text-gray-400" />
                  <div>
                    <p class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                      {{ file.object_key }}
                    </p>
                    <p class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                      {{ formatStorage(file.file_size) }}
                    </p>
                  </div>
                </div>
                <span class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                  {{ formatDate(file.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end tw-space-x-3 tw-mt-6">
          <button
            @click="$emit('close')"
            class="tw-px-4 tw-py-2 tw-bg-gray-300 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-400 dark:tw-bg-gray-600 dark:tw-text-gray-300 dark:hover:tw-bg-gray-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'
import {
  X,
  Loader2,
  HardDrive,
  Activity,
  Database,
  FileText,
  Zap,
  File
} from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  userInfo: Object,
  packageInfo: Object,
  tenantInfo: Object,
  userId: Number
})

const emit = defineEmits(['close'])

const loading = ref(false)
const filesLoading = ref(false)
const usageStats = ref(null)
const userFiles = ref([])
const urlBase = import.meta.env.VITE_API_URL

const maxDailySize = computed(() => {
  if (!usageStats.value?.dailyStats) return 1
  return Math.max(...usageStats.value.dailyStats.map(stat => stat.totalSize), 1)
})

const fetchUsageStats = async () => {
  if (!props.userId) return
  
  loading.value = true
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${urlBase}/api/service-data/admin/usage-statistics?user_id=${props.userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Lỗi khi tải thống kê')

    const data = await response.json()
    usageStats.value = data
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    toast.error('Lỗi khi tải thống kê sử dụng')
  } finally {
    loading.value = false
  }
}

const loadUserFiles = async () => {
  if (!props.userId) return
  
  filesLoading.value = true
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${urlBase}/api/service-data/admin/user/${props.userId}/files?limit=20`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Lỗi khi tải danh sách file')

    const data = await response.json()
    userFiles.value = data.data
  } catch (error) {
    console.error('Error fetching user files:', error)
    toast.error('Lỗi khi tải danh sách file')
  } finally {
    filesLoading.value = false
  }
}

const formatStorage = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    month: '2-digit',
    day: '2-digit'
  })
}

watch(() => props.show, (newVal) => {
  if (newVal && props.userId) {
    fetchUsageStats()
    loadUserFiles()
  }
})
</script> 