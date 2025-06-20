<template>
  <div class="tw-flex tw-h-full tw-min-h-[calc(100vh-4rem)] tw-bg-gray-50 dark:tw-bg-gray-900 tw-items-center tw-justify-center">
    <div class="tw-container tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-w-full tw-max-w-6xl tw-py-8">
      <!-- Upload Card -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-8 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-border tw-border-gray-200">
        <h2 class="tw-text-2xl tw-font-bold tw-mb-4 tw-text-blue-700">Tải lên tệp tin</h2>
        <input type="file" @change="onFileChange" class="tw-mb-4" />
        <button @click="handleUpload" :disabled="!selectedFile || uploading" class="tw-bg-blue-600 tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-font-semibold" >
          <span v-if="uploading">Đang tải lên...</span>
          <span v-else>Upload</span>
        </button>
        <div v-if="uploadedFileName" class="tw-mt-4 tw-text-green-600">
          Đã upload: <span class="tw-font-semibold">{{ uploadedFileName }}</span>
        </div>
        <div v-if="uploadError" class="tw-mt-4 tw-text-red-600">
          {{ uploadError }}
        </div>
        <div class="tw-mt-6 tw-w-full">
          <div class="tw-mb-2 tw-font-semibold">Dung lượng đã dùng: {{ formatFileSize(usage.used) }} / {{ formatFileSize(usage.limit) }}</div>
          <div class="tw-h-2 tw-bg-gray-200 tw-rounded">
            <div class="tw-h-2 tw-bg-blue-500 tw-rounded" :style="{ width: usage.limit ? ((usage.used / usage.limit) * 100).toFixed(2) + '%' : '0%' }"></div>
          </div>
        </div>
        <div class="tw-mt-6 tw-w-full">
          <div class="tw-font-semibold tw-mb-2">Danh sách file chi tiết:</div>
          <div v-if="files.length === 0" class="tw-text-gray-500">Chưa có file nào</div>
          <table v-else class="tw-w-full tw-text-xs tw-bg-white tw-rounded tw-shadow">
            <thead>
              <tr>
                <th>data_id</th>
                <th>tenant_id</th>
                <th>user_id</th>
                <th>package_id</th>
                <th>object_key</th>
                <th>file_size</th>
                <th>bandwidth_used</th>
                <th>database_used</th>
                <th>api_calls_used</th>
                <th>created_at</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in files" :key="file.data_id">
                <td>{{ file.data_id || file.dataId }}</td>
                <td>{{ file.tenant_id || file.tenantId }}</td>
                <td>{{ file.user_id }}</td>
                <td>{{ file.package_id }}</td>
                <td>{{ file.object_key }}</td>
                <td>{{ formatFileSize(file.file_size || file.fileSize) }}</td>
                <td>{{ file.bandwidth_used }}</td>
                <td>{{ file.database_used }}</td>
                <td>{{ file.api_calls_used }}</td>
                <td>{{ file.created_at }}</td>
                <td>{{ file.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Statistic Card -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-8 tw-w-full md:tw-w-1/3 tw-h-fit tw-border tw-border-gray-200 tw-flex-shrink-0">
        <h3 class="tw-text-lg tw-font-bold tw-mb-4 tw-text-gray-700">Statistics</h3>
        <ul class="tw-space-y-2">
          <li class="tw-flex tw-justify-between"><span>Databases</span><span class="tw-font-bold">2</span></li>
          <li class="tw-flex tw-justify-between"><span>Disk Usage</span><span class="tw-font-bold">{{ formatFileSize(usage.used) }} / {{ formatFileSize(usage.limit) }}</span></li>
          <li class="tw-flex tw-justify-between"><span>Subdomains</span><span class="tw-font-bold">1 / 4</span></li>
          <li class="tw-flex tw-justify-between"><span>Bandwidth</span><span class="tw-font-bold">63.1 MB</span></li>
          <li class="tw-flex tw-justify-between"><span>Email Accounts</span><span class="tw-font-bold">0 / 2</span></li>
          <li class="tw-flex tw-justify-between"><span>Alias Domains</span><span class="tw-font-bold">0 / 1</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFileUpload } from '../composables/useFileUpload'
import axios from 'axios'

const selectedFile = ref(null)
const uploadedFileName = ref('')
const uploadError = ref('')
const uploading = ref(false)

// State cho usage và files
const usage = ref({ used: 0, limit: 0 })
const files = ref([])

// Lấy user info từ localStorage/sessionStorage hoặc token (giả sử đã lưu)
const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user')) || {}
const tenant_id = user.tenant_id
const user_id = user.user_id
const package_id = user.package_id || 1

const { uploadFile, getFiles } = useFileUpload()

function onFileChange(e) {
  selectedFile.value = e.target.files[0]
}

async function fetchUsage() {
  try {
    // Gọi API lấy usage cho user
    const res = await axios.get('/api/service-data/stats/user', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    // Giả sử trả về mảng stats, lấy phần tử đầu tiên
    const stat = res.data[0] || {}
    usage.value.used = stat.total_file_size || 0
    usage.value.limit = stat.package?.file_storage_limit || 0
  } catch (err) {
    usage.value.used = 0
    usage.value.limit = 0
  }
}

async function fetchFiles() {
  try {
    const res = await getFiles(tenant_id, user_id, package_id)
    files.value = res.files || []
  } catch (err) {
    files.value = []
  }
}

async function handleUpload() {
  uploadError.value = ''
  if (selectedFile.value) {
    uploading.value = true
    try {
      const res = await uploadFile(selectedFile.value, tenant_id, user_id, package_id)
      uploadedFileName.value = res.fileName || selectedFile.value.name
      selectedFile.value = null
      await fetchUsage()
      await fetchFiles()
    } catch (err) {
      uploadError.value = err.response?.data?.error || err.message || 'Có lỗi xảy ra khi upload file'
    } finally {
      uploading.value = false
    }
  }
}

onMounted(async () => {
  await fetchUsage()
  await fetchFiles()
})

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function isImage(file) {
  return file.mimeType?.startsWith('image/') || file.originalName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
}
</script> 