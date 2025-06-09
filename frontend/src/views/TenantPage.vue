<template>
  <div class="tw-p-6">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4 dark:tw-text-white">Quản lý Tenant</h1>

    <!-- Thanh điều hướng -->
    <div class="tw-flex tw-gap-4 tw-mb-4">
      <button @click="currentTab = 'list'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'list', 'tw-bg-gray-200': currentTab !== 'list'}" class="tw-px-4 tw-py-2 tw-rounded">
        Danh sách tenant
      </button>
      <button @click="currentTab = 'restore'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'restore', 'tw-bg-gray-200': currentTab !== 'restore'}" class="tw-px-4 tw-py-2 tw-rounded">
        Khôi phục
      </button>
    </div>

    <!-- Bảng hiển thị tenants -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Tên doanh nghiệp</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Admin Email</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tenant in paginatedTenants"
            :key="tenant.tenant_id"
            class="tw-border-b dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700"
          >
            <td class="tw-px-4 tw-py-2 tw-text-center">{{ tenant.tenant_id }}</td>
            <td class="tw-px-4 tw-py-2">{{ tenant.name }}</td>
            <td class="tw-px-4 tw-py-2">{{ tenant.adminUser?.email || '—' }}</td>
            <td class="tw-px-4 tw-py-2">
              {{ new Date(tenant.created_at || '').toLocaleDateString('vi-VN') }}
            </td>
            <td class="tw-px-4 tw-py-2">
              <span
                :class="[
                  'tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-rounded-full',
                  tenant.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  tenant.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                  'tw-bg-red-100 tw-text-red-700'
                ]"
              >
                {{ tenant.status }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-2 tw-text-center">
              <div class="tw-relative">
                <button @click="openModal('view', tenant)" class="tw-mr-2 tw-text-green-600">
                  <Eye class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="currentTab === 'list'" @click="openModal('edit', tenant)" class="tw-mr-2 tw-text-[#086df9]">
                  <Edit class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="currentTab === 'list'" @click="moveToTrash(tenant)" class="tw-text-red-600">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="currentTab === 'restore'" @click="restoreTenant(tenant)" class="tw-mr-2 tw-text-[#086df9]">
                  <RefreshCcw class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="currentTab === 'restore'" @click="permanentlyDelete(tenant)" class="tw-text-red-600">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="tw-mt-4 tw-flex tw-justify-between tw-items-center">
      <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, sortedTenants.length) }} của {{ sortedTenants.length }} tenant
      </div>
      <div class="tw-flex tw-gap-2">
        <button
          @click="currentPage = Math.max(currentPage - 1, 1)"
          :disabled="currentPage === 1"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700"
        >
          <ArrowLeft class="tw-w-4 tw-h-4" />
        </button>
        <span class="tw-px-3 tw-py-1 tw-text-sm dark:tw-text-white">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="currentPage = Math.min(currentPage + 1, totalPages)"
          :disabled="currentPage === totalPages"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700"
        >
          <ArrowRight class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="modal.open" class="tw-fixed tw-inset-0 tw-bg-black/30 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="closeModal">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-md tw-p-6 tw-relative">
        <button @click="closeModal" class="tw-absolute tw-top-2 tw-right-2 tw-text-[#086df9] hover:tw-text-blue-700">
          <X class="tw-w-5 tw-h-5" />
        </button>
        <h2 class="tw-text-xl tw-font-bold tw-mb-4 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-2">
            <Info v-if="modal.mode === 'view'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết Tenant' : 'Chỉnh sửa Tenant' }}
        </h2>

        <div class="tw-space-y-4">
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">ID</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Hash class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.tenant_id"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Tên doanh nghiệp</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Building class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode !== 'edit'"
                v-model="modal.tenant.name"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Admin Email</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Mail class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.adminUser?.email"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Calendar class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="new Date(modal.tenant.created_at || '').toLocaleDateString('vi-VN')"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Trạng thái</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Activity class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <select
                v-model="modal.tenant.status"
                :disabled="modal.mode !== 'edit'"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="deleted">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-2">
          <button
            @click="closeModal"
            class="tw-bg-gray-300 tw-text-gray-800 tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-400 tw-flex tw-items-center"
          >
            <X class="tw-w-4 tw-h-4 tw-mr-2" /> Đóng
          </button>
          <button
            v-if="modal.mode === 'edit'"
            @click="updateTenant"
            class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center"
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

// Lọc tenants dựa trên tab hiện tại
const filteredTenants = computed(() => {
  if (currentTab.value === 'list') {
    return tenants.value.filter(t => t.status === 'active' || t.status === 'inactive')
  } else {
    return tenants.value.filter(t => t.status === 'deleted')
  }
})

// Sắp xếp tenants theo created_at giảm dần
const sortedTenants = computed(() =>
  [...filteredTenants.value].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })
)

// Tính toán dữ liệu phân trang
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
    })
  } catch (err) {
    console.error('Lỗi cập nhật:', err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể cập nhật tenant!',
      confirmButtonColor: '#086df9',
    })
  }
}

const moveToTrash = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển tenant ${tenant.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
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
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể chuyển tenant!',
        confirmButtonColor: '#086df9',
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
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể khôi phục tenant!',
        confirmButtonColor: '#086df9',
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
      })
    } catch (err) {
      console.error('Lỗi xóa:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa tenant!',
        confirmButtonColor: '#086df9',
      })
    }
  }
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
  border-color: #086df9;
  box-shadow: 0 0 0 3px rgba(8, 109, 249, 0.3);
}
</style>