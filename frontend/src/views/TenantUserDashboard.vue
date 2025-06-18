<template>
  <div class="tw-flex tw-h-full tw-min-h-[calc(100vh-4rem)] tw-bg-gray-50 dark:tw-bg-gray-900 tw-items-center tw-justify-center">
    <div class="tw-container tw-mx-auto tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-w-full tw-max-w-6xl tw-py-8">
      <!-- Upload Card -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-8 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-border tw-border-gray-200">
        <h2 class="tw-text-2xl tw-font-bold tw-mb-4 tw-text-blue-700">Tải lên tệp tin</h2>
        <input type="file" @change="onFileChange" class="tw-mb-4" />
        <button @click="uploadFile" :disabled="!selectedFile" class="tw-bg-blue-600 tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-font-semibold" >
          Upload
        </button>
        <div v-if="uploadedFileName" class="tw-mt-4 tw-text-green-600">
          Đã upload: <span class="tw-font-semibold">{{ uploadedFileName }}</span>
        </div>
      </div>
      <!-- Statistic Card -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-8 tw-w-full md:tw-w-1/3 tw-h-fit tw-border tw-border-gray-200 tw-flex-shrink-0">
        <h3 class="tw-text-lg tw-font-bold tw-mb-4 tw-text-gray-700">Statistics</h3>
        <ul class="tw-space-y-2">
          <li class="tw-flex tw-justify-between"><span>Databases</span><span class="tw-font-bold">2</span></li>
          <li class="tw-flex tw-justify-between"><span>Disk Usage</span><span class="tw-font-bold">415.76 MB</span></li>
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
import { ref } from 'vue'

const selectedFile = ref(null)
const uploadedFileName = ref('')

function onFileChange(e) {
  selectedFile.value = e.target.files[0]
}

function uploadFile() {
  if (selectedFile.value) {
    // Mock upload
    setTimeout(() => {
      uploadedFileName.value = selectedFile.value.name
      selectedFile.value = null
    }, 800)
  }
}
</script> 