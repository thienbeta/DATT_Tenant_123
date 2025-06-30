<template>
  <div class="tw-p-4">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4">Cửa hàng</h1>
    <router-view />
    
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>