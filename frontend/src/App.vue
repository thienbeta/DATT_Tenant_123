<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LayoutAdmin from './layouts/LayoutAdmin.vue'

const route = useRoute()

const layout = computed(() => {
  return route.meta.layout === 'none' ? 'div' : LayoutAdmin
})
</script>
