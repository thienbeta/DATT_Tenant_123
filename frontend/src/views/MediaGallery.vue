<template>
  <div class="tw-container tw-mx-auto tw-p-4">
    <h1 class="tw-text-3xl tw-font-bold tw-mb-6">Thư viện Media</h1>
    <div v-if="loading" class="tw-text-center">
      <p>Đang tải...</p>
    </div>
    <div v-else-if="error" class="tw-text-center tw-text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="files.length === 0" class="tw-text-center tw-text-gray-500">
      <p>Không có file nào trong thư viện.</p>
    </div>
    <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-6 tw-gap-4">
      <div
        v-for="file in files"
        :key="file.object_key"
        class="tw-group tw-relative tw-border tw-rounded-lg tw-overflow-hidden tw-shadow-md"
      >
        <a :href="file.url" target="_blank" rel="noopener noreferrer">
          <!-- Hiển thị ảnh hoặc video -->
          <img
            v-if="isImage(file.object_key)"
            :src="file.url"
            :alt="file.object_key"
            class="tw-w-full tw-h-40 tw-object-cover tw-transition-transform tw-duration-300 group-hover:tw-scale-110"
          />
          <video
            v-else-if="isVideo(file.object_key)"
            :src="file.url"
            class="tw-w-full tw-h-40 tw-object-cover"
            controls
          ></video>
          <!-- Icon cho các loại file khác -->
          <div v-else class="tw-w-full tw-h-40 tw-flex tw-items-center tw-justify-center tw-bg-gray-100">
            <svg class="tw-w-16 tw-h-16 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
        </a>
        <div class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-black tw-bg-opacity-50 tw-text-white tw-text-xs tw-p-2 tw-truncate">
          {{ file.object_key }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const files = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchTenantFiles = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/service-data/tenant-files', {
      withCredentials: true, // Gửi cookie session để xác thực
    });
    files.value = response.data.filter(file => file.url); // Lọc bỏ các file không có URL
  } catch (err) {
    console.error('Failed to fetch tenant files:', err);
    error.value = 'Không thể tải danh sách file. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

const isImage = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

const isVideo = (filename) => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
  return videoExtensions.includes(getFileExtension(filename));
};

onMounted(fetchTenantFiles);
</script> 