<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Tất cả file/ảnh của tenant</h1>
    <div v-if="loading" class="text-blue-600">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <div v-if="files.length === 0" class="text-gray-500">Chưa có file nào.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="file in files" :key="file.name" class="border rounded-lg p-3 bg-white shadow hover:shadow-lg transition">
          <div class="mb-2 flex justify-center items-center h-32">
            <img v-if="file.mimeType && file.mimeType.startsWith('image/')" :src="file.fileUrl" :alt="file.originalName" class="object-cover h-32 w-full rounded" />
            <div v-else class="flex flex-col items-center justify-center w-full h-full text-4xl">
              <span>{{ getFileIcon(file.mimeType) }}</span>
              <span class="text-xs mt-2">{{ file.mimeType }}</span>
            </div>
          </div>
          <div class="truncate font-medium" :title="file.originalName">{{ file.originalName }}</div>
          <div class="text-xs text-gray-500">Dung lượng: {{ formatFileSize(file.size) }}</div>
          <div class="text-xs text-gray-500">Người upload: {{ file.user_email || file.user_id }}</div>
          <div class="text-xs text-gray-400 mt-1">Gói: {{ file.package_id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const files = ref([])
const loading = ref(true)
const error = ref('')

function getStoredUser() {
    
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(mimeType) {
  if (!mimeType) return '📎'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.startsWith('text/')) return '📝'
  if (mimeType.includes('word')) return '📘'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
  return '📎'
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const user = getStoredUser()
    if (!user || !user.tenant_id) {
      error.value = 'Không tìm thấy thông tin tenant.'
      loading.value = false
      return
    }
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const res = await axios.get(
      'http://localhost:3000/api/file-upload/all-files',
      {
        params: { tenant_id: user.tenant_id },
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    files.value = res.data.files || []

    setTimeout(async () => {
      let totalNewBandwidth = 0;
      performance.getEntriesByType('resource').forEach(e => {
        if (
          (e.initiatorType === 'img' || e.name.includes('/api/file-upload/serve/')) &&
          e.transferSize > 0 && e.transferSize === e.encodedBodySize
        ) {
          totalNewBandwidth += e.transferSize;
        }
      });

      if (totalNewBandwidth > 0) {
        if (user && user.tenant_id && user.user_id && user.package_id) {
          await axios.post('http://localhost:3000/api/usage/bandwidth', {
            tenant_id: user.tenant_id,
            user_id: user.user_id,
            package_id: user.package_id,
            bandwidth_used: totalNewBandwidth
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.error || 'Lỗi khi tải danh sách file.'
  } finally {
    loading.value = false
  }
})
</script>
