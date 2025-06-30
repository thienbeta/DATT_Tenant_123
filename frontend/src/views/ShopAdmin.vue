<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Danh sách file đã upload của tenant</h2>
    <ul class="space-y-2">
      <li v-for="file in files" :key="file.data_id" class="flex items-center gap-2">
        <a :href="file.url" target="_blank">{{ file.object_key }}</a>
        <span class="text-gray-500 text-sm">({{ file.file_size }} bytes)</span>
      </li>
    </ul>
    <div v-if="files.length === 0" class="text-gray-500 mt-4">Không có file nào.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useServiceData } from '../composables/useServiceData';
const files = ref([]);
const { getTenantFiles } = useServiceData();
onMounted(async () => {
  files.value = await getTenantFiles();
});
</script> 