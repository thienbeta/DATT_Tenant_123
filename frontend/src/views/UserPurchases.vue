<script setup>
import { ref, onMounted } from 'vue'

const purchases = ref([])

// Lấy user_id từ localStorage hoặc sessionStorage
const userId = localStorage.getItem('user_id') || sessionStorage.getItem('user_id')

const fetchPurchases = async () => {
  if (!userId) {
    purchases.value = []
    return
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user-purchases?user_id=${userId}`)
  purchases.value = await res.json()
}

onMounted(fetchPurchases)
</script>

<template>
  <div>
    <h2>Danh sách user purchases</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Package ID</th>
          <th>Tenant ID</th>
          <th>Purchase Date</th>
          <th>Status</th>
          <th>Payment ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in purchases" :key="item.purchase_id">
          <td>{{ item.purchase_id }}</td>
          <td>{{ item.user_id }}</td>
          <td>{{ item.package_id }}</td>
          <td>{{ item.tenant_id }}</td>
          <td>{{ item.purchase_date }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.payment_id }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>