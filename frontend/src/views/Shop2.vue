<template>
  <div>
    <div v-if="selectedPurchase && usage">
      <h2 class="tw-font-bold tw-mb-2">Gói dung lượng đã mua:</h2>
      <ul>
        <li>
          <b>Tên gói:</b> {{ selectedPurchase.package_id }}<br>
          <b>Dung lượng tối đa:</b> {{ (usage.file_storage_limit / (1024*1024*1024)).toFixed(2) }} GB<br>
          <b>Đã sử dụng:</b> {{ (usage.used / (1024*1024)).toFixed(2) }} MB ({{ (usage.used / (1024*1024*1024)).toFixed(2) }} GB)<br>
          <!-- <b>Còn lại:</b> {{ ((usage.file_storage_limit - usage.used) / (1024*1024)).toFixed(2) }} MB ({{ ((usage.file_storage_limit - usage.used) / (1024*1024*1024)).toFixed(2) }} GB) -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const purchases = ref([])
const selectedPurchase = ref(null)
const usage = ref(null)
const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id')

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
    // Gọi lại usage để cập nhật dung lượng đã dùng
    await fetchUsage(selectedPurchase.value.purchase_id)
  } else {
    uploadMessage.value = 'Có lỗi xảy ra khi upload!'
  }
}

onMounted(fetchPurchases)
</script>
