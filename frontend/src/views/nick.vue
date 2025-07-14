<template>
  <div>
    <div v-if="selectedPurchase && usage">
      <h2 class="tw-font-bold tw-mb-2">Gói dung lượng đã mua:</h2>
      <ul>
        <li>
          <b>Tên gói:</b> {{ selectedPurchase.package_id }}<br>
          <b>Dung lượng tối đa:</b> {{ (usage.file_storage_limit / (1024*1024*1024)).toFixed(2) }} GB<br>
          <b>Đã sử dụng:</b> {{ (usage.used / (1024*1024)).toFixed(2) }} MB ({{ (usage.used / (1024*1024*1024)).toFixed(2) }} GB)<br>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Bạn chưa mua gói dung lượng nào.</p>
    </div>

    <h3 class="tw-font-bold tw-mb-2 tw-mt-6">Upload ảnh sử dụng gói dung lượng</h3>
    <form @submit.prevent="handleImageUpload" class="tw-flex tw-gap-2 tw-items-center">
      <input
        type="file"
        accept="image/*"
        @change="onFileChange"
        required
        class="tw-border tw-rounded tw-px-3 tw-py-1"
      />
      <button type="submit" class="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-1 tw-rounded">Upload</button>
    </form>
    <div v-if="uploadMessage" class="tw-mt-2 tw-text-green-600">{{ uploadMessage }}</div>
    <div v-if="previewUrl" class="tw-mt-2">
      <img :src="previewUrl" alt="Preview" style="max-width: 200px; border-radius: 8px;" />
    </div>

    <!-- HIỂN THỊ DANH SÁCH ẢNH ĐÃ UPLOAD -->
    <div class="tw-mt-8">
      <h3 class="tw-font-bold tw-mb-4">Danh sách ảnh đã upload</h3>
      
      <!-- Loading state -->
      <div v-if="loadingImages" class="tw-text-center tw-py-4">
        Đang tải ảnh...
      </div>
      
      <!-- No images -->
      <div v-else-if="userImages.length === 0" class="tw-text-gray-500 tw-text-center tw-py-4">
        Chưa có ảnh nào được upload
      </div>
      
      <!-- Image gallery -->
      <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-4">
        <div 
          v-for="image in userImages" 
          :key="image.id"
          class="tw-border tw-rounded-lg tw-p-2 tw-bg-white tw-shadow-sm"
        >
          <!-- Image display -->
          <div class="tw-relative tw-mb-2">
            <img 
              :src="getImageUrl(image.object_key)" 
              :alt="image.object_key"
              class="tw-w-full tw-h-32 tw-object-cover tw-rounded"
              @error="handleImageError"
              loading="lazy"
            />
            <!-- Delete button -->
            <button 
              @click="deleteImage(image.id)"
              class="tw-absolute tw-top-1 tw-right-1 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-xs hover:tw-bg-red-600"
            >
              ×
            </button>
          </div>
          
          <!-- Image info -->
          <div class="tw-text-xs tw-text-gray-600">
            <div class="tw-truncate" :title="image.object_key">
              {{ image.object_key }}
            </div>
            <div>
              Kích thước: {{ formatFileSize(image.file_size) }}
            </div>
            <div>
              {{ formatDate(image.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const purchases = ref([])
const selectedPurchase = ref(null)
const usage = ref(null)
const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id')

// Image gallery states
const userImages = ref([])
const loadingImages = ref(false)

const fetchPurchases = async () => {
  if (!userId) {
    purchases.value = []
    return
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user-purchases?user_id=${userId}`)
  purchases.value = await res.json()
  if (purchases.value.length > 0) {
    selectedPurchase.value = purchases.value[0]
    await fetchUsage(selectedPurchase.value.purchase_id)
  }
}

const fetchUsage = async (purchaseId) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user-purchases/${purchaseId}/usage`)
  usage.value = await res.json()
}

// Fetch user images
const fetchUserImages = async () => {
  if (!userId) return
  
  loadingImages.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-data/user/${userId}/images`)
    if (res.ok) {
      userImages.value = await res.json()
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loadingImages.value = false
  }
}

// Get image URL from MinIO
const getImageUrl = (objectKey) => {
  // Phương pháp 1: Sử dụng stream endpoint (recommend)
  return `${import.meta.env.VITE_API_URL}/api/service-data/image/${objectKey}`
  
  // Phương pháp 2: Sử dụng presigned URL (nếu cần)
  // return `${import.meta.env.VITE_API_URL}/api/service-data/image-url/${objectKey}`
}

// Handle image load error
const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg=='
}

// Delete image
const deleteImage = async (imageId) => {
  if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-data/${imageId}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      // Remove from local array
      userImages.value = userImages.value.filter(img => img.id !== imageId)
      // Refresh usage
      if (selectedPurchase.value) {
        await fetchUsage(selectedPurchase.value.purchase_id)
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Upload functionality
const uploadMessage = ref('')
const selectedFile = ref(null)
const previewUrl = ref('')

const onFileChange = (e) => {
  const file = e.target.files[0]
  selectedFile.value = file
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  } else {
    previewUrl.value = ''
  }
}

const handleImageUpload = async () => {
  if (!selectedFile.value || !selectedPurchase.value) {
    uploadMessage.value = 'Vui lòng chọn ảnh và gói!'
    return
  }
  const formData = new FormData()
  formData.append('image', selectedFile.value)
  formData.append('user_id', userId)
  formData.append('package_id', selectedPurchase.value.package_id)
  formData.append('tenant_id', selectedPurchase.value.tenant_id)
  formData.append('file_size', selectedFile.value.size)
  formData.append('purchase_id', selectedPurchase.value.purchase_id)
  
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-data/upload`, {
    method: 'POST',
    body: formData
  })
  if (res.ok) {
    uploadMessage.value = 'Upload thành công!'
    selectedFile.value = null
    previewUrl.value = ''
    // Refresh data
    await fetchUsage(selectedPurchase.value.purchase_id)
    await fetchUserImages()
  } else {
    uploadMessage.value = 'Có lỗi xảy ra khi upload!'
  }
}

onMounted(async () => {
  await fetchPurchases()
  await fetchUserImages()
})
</script>