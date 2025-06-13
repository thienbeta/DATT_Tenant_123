<template>
  <div class="tw-p-6 tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <h1 class="tw-text-3xl tw-font-semibold tw-mb-6 tw-text-gray-800 dark:tw-text-white">Quản lý Tenant</h1>

    <!-- Thanh điều hướng -->
<div class="tw-flex tw-gap-4 tw-mb-6">
  <button
    @click="currentTab = 'list'"
    :class="{
      'tw-bg-[#086df9] tw-text-white': currentTab === 'list',
      'tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:tw-text-gray-300': currentTab !== 'list'
    }"
    class="tw-px-5 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-duration-300 hover:tw-bg-blue-600 hover:tw-text-white tw-flex tw-items-center tw-gap-2"
  >
    <List class="tw-w-5 tw-h-5" /> Danh sách Tenant
  </button>

  <button
    @click="currentTab = 'restore'"
    :class="{
      'tw-bg-[#086df9] tw-text-white': currentTab === 'restore',
      'tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:tw-text-gray-300': currentTab !== 'restore'
    }"
    class="tw-px-5 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-duration-300 hover:tw-bg-blue-600 hover:tw-text-white tw-flex tw-items-center tw-gap-2"
  >
    <Recycle class="tw-w-5 tw-h-5" /> Khôi phục
  </button>
</div>


    <!-- Tìm kiếm và bộ lọc -->
    <div class="tw-mb-6 tw-flex tw-gap-4 tw-items-center">
      <!-- Tìm kiếm -->
      <div class="tw-relative tw-w-full tw-max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm..."
          class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:tw-placeholder-gray-400"
          @input="filterTenants"
        />
        <span class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400">
          <Search class="tw-w-5 tw-h-5" />
        </span>
      </div>

      <!-- Bộ lọc trạng thái -->
      <select
        v-model="statusFilter"
        class="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
        @change="filterTenants"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Tạm dừng</option>
      </select>
    </div>

    <!-- Bảng hiển thị tenants -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Tên doanh nghiệp</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Admin Email</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tenant in paginatedTenants"
            :key="tenant.tenant_id"
            class="tw-border-b dark:tw-border-gray-700 tw-transition tw-duration-200 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700"
          >
            <td class="tw-px-6 tw-py-4 tw-text-center tw-text-gray-700 dark:tw-text-gray-300">{{ tenant.tenant_id }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">{{ tenant.name }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">{{ tenant.adminUser?.email || '—' }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">
              {{ new Date(tenant.created_at || '').toLocaleDateString('vi-VN') }}
            </td>
            <td class="tw-px-6 tw-py-4">
              <span
                :class="[
                  'tw-inline-block tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full',
                  tenant.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  tenant.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                  'tw-bg-red-100 tw-text-red-700'
                ]"
              >
                {{ tenant.status === 'active' ? 'Hoạt động' : tenant.status === 'inactive' ? 'Tạm dừng' : 'Đã xóa' }}
              </span>
            </td>
            <td class="tw-px-6 tw-py-4 tw-text-center tw-flex tw-justify-center tw-gap-2">
              <button @click="openModal('view', tenant)" class="tw-text-green-600 hover:tw-text-green-800 tw-transition">
                <Eye class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="openModal('edit', tenant)" class="tw-text-[#086df9] hover:tw-text-blue-700 tw-transition">
                <Edit class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="moveToTrash(tenant)" class="tw-text-red-600 hover:tw-text-red-800 tw-transition">
                <Trash2 class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'restore'" @click="restoreTenant(tenant)" class="tw-text-[#086df9] hover:tw-text-blue-700 tw-transition">
                <RefreshCcw class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'restore'" @click="permanentlyDelete(tenant)" class="tw-text-red-600 hover:tw-text-red-800 tw-transition">
                <Trash2 class="tw-w-5 tw-h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="tw-mt-6 tw-flex tw-justify-between tw-items-center tw-text-gray-600 dark:tw-text-gray-300">
      <div class="tw-text-sm">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredTenants.length) }} của {{ filteredTenants.length }} tenant
      </div>
      <div class="tw-flex tw-gap-3">
        <button
          @click="currentPage = Math.max(currentPage - 1, 1)"
          :disabled="currentPage === 1"
          class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-[#086df9] tw-text-white disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed hover:tw-bg-blue-700 tw-transition"
        >
          <ArrowLeft class="tw-w-4 tw-h-4" />
        </button>
        <span class="tw-px-4 tw-py-2 tw-text-sm tw-font-medium dark:tw-text-white">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="currentPage = Math.min(currentPage + 1, totalPages)"
          :disabled="currentPage === totalPages"
          class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-[#086df9] tw-text-white disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed hover:tw-bg-blue-700 tw-transition"
        >
          <ArrowRight class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="modal.open" class="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="closeModal">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-2xl tw-w-full tw-max-w-lg tw-p-6 tw-relative tw-animate-fade-in">
        <button @click="closeModal" class="tw-absolute tw-top-3 tw-right-3 tw-text-gray-500 hover:tw-text-[#086df9] tw-transition">
          <X class="tw-w-6 tw-h-6" />
        </button>
        <h2 class="tw-text-2xl tw-font-semibold tw-mb-6 tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-3">
            <Info v-if="modal.mode === 'view'" class="tw-w-6 tw-h-6 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-6 tw-h-6 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết Tenant' : 'Chỉnh sửa Tenant' }}
        </h2>

        <div class="tw-space-y-5">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">ID</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Hash class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.tenant_id"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Tên doanh nghiệp</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Building class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode !== 'edit'"
                v-model="modal.tenant.name"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Admin Email</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Mail class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.adminUser?.email"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Calendar class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="new Date(modal.tenant.created_at || '').toLocaleDateString('vi-VN')"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Trạng thái</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Activity class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <select
                v-model="modal.tenant.status"
                :disabled="modal.mode !== 'edit'"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="deleted">Đã xóa</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-3">
          <button
            @click="closeModal"
            class="tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg tw-font-medium hover:tw-bg-gray-300 tw-transition tw-flex tw-items-center"
          >
            <X class="tw-w-4 tw-h-4 tw-mr-2" /> Đóng
          </button>
          <button
            v-if="modal.mode === 'edit'"
            @click="updateTenant"
            class="tw-px-4 tw-py-2 tw-bg-[#086df9] tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 tw-transition tw-flex tw-items-center"
          >
            <Save class="tw-w-4 tw-h-4 tw-mr-2" /> Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import {
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Info,
  Hash,
  Building,
  Mail,
  Calendar,
  Activity,
  X,
  Save,
  RefreshCcw,
  Search,
  List,
  Recycle,
} from 'lucide-vue-next'

interface AdminUser {
  user_id: number
  email: string
}

interface Tenant {
  tenant_id: number
  name: string
  status: 'active' | 'inactive' | 'deleted'
  adminUser?: AdminUser
  created_at?: string
}

const tenants = ref<Tenant[]>([])
const modal = ref<{ open: boolean; mode: 'view' | 'edit'; tenant: Tenant }>({
  open: false,
  mode: 'view',
  tenant: {} as Tenant,
})
const currentPage = ref(1)
const itemsPerPage = 20
const currentTab = ref('list')
const searchQuery = ref('')
const statusFilter = ref('')

const filteredTenants = computed(() => {
  let result = tenants.value
  if (currentTab.value === 'list') {
    result = result.filter(t => t.status === 'active' || t.status === 'inactive')
  } else {
    result = result.filter(t => t.status === 'deleted')
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(query) || 
      (t.adminUser?.email?.toLowerCase() || '').includes(query)
    )
  }
  if (statusFilter.value && statusFilter.value !== '') {
    result = result.filter(t => t.status === statusFilter.value)
  }
  return result
})

const sortedTenants = computed(() =>
  [...filteredTenants.value].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })
)

const totalPages = computed(() => Math.ceil(sortedTenants.value.length / itemsPerPage))
const paginatedTenants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedTenants.value.slice(start, end)
})

const openModal = (mode: 'view' | 'edit', tenant: Tenant) => {
  modal.value = { open: true, mode, tenant: { ...tenant } }
}

const closeModal = () => {
  modal.value.open = false
}

const fetchTenants = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants`)
    if (!res.ok) throw new Error('Lỗi khi gọi API')
    const data = await res.json()
    tenants.value = data
  } catch (err) {
    console.error('Lỗi khi tải tenants:', err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể tải danh sách tenant!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }
}

const updateTenant = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${modal.value.tenant.tenant_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modal.value.tenant),
    })
    if (!res.ok) throw new Error('Lỗi khi cập nhật')
    await fetchTenants()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật tenant thành công!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  } catch (err) {
    console.error('Lỗi cập nhật:', err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể cập nhật tenant!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }
}

const moveToTrash = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển tenant ${tenant.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086519',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const updatedTenant = { ...tenant, status: 'deleted' }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTenant),
      })
      if (!res.ok) throw new Error('Lỗi khi cập nhật')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tenant đã được chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể chuyển tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const restoreTenant = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục tenant ${tenant.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const updatedTenant = { ...tenant, status: 'active' }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTenant),
      })
      if (!res.ok) throw new Error('Lỗi khi cập nhật')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tenant đã được khôi phục!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể khôi phục tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const permanentlyDelete = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa vĩnh viễn',
    text: `Bạn có chắc muốn xóa vĩnh viễn tenant ${tenant.name}? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Lỗi xóa')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa',
        text: 'Tenant đã được xóa vĩnh viễn!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi xóa:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const filterTenants = () => {
  currentPage.value = 1
}

onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}

input:focus,
select:focus {
  outline: none;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>