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

    <!-- Danh sách Tenant và Thống kê -->
    <div v-for="tenant in paginatedTenants" :key="tenant.tenant_id" class="tw-mb-6">
      <!-- Thống kê người dùng -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4 tw-mb-4">
        <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">Tổng số người dùng</p>
              <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-white">
                {{ tenantStats[tenant.tenant_id]?.totalUsers || 0 }}
              </h3>
            </div>
            <div class="tw-p-3 tw-bg-blue-100 dark:tw-bg-blue-900 tw-rounded-full">
              <Users class="tw-w-6 tw-h-6 tw-text-blue-600 dark:tw-text-blue-400" />
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">Người dùng mới (7 ngày)</p>
              <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-white">
                {{ tenantStats[tenant.tenant_id]?.recentUsers || 0 }}
              </h3>
            </div>
            <div class="tw-p-3 tw-bg-green-100 dark:tw-bg-green-900 tw-rounded-full">
              <UserPlus class="tw-w-6 tw-h-6 tw-text-green-600 dark:tw-text-green-400" />
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">Người dùng theo vai trò</p>
              <div class="tw-mt-2">
                <div v-for="(count, role) in tenantStats[tenant.tenant_id]?.usersByRole || {}" :key="role" class="tw-flex tw-justify-between tw-items-center tw-mb-1">
                  <span class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">{{ formatRole(role) }}</span>
                  <span class="tw-font-semibold tw-text-gray-800 dark:tw-text-white">{{ count }}</span>
                </div>
              </div>
            </div>
            <div class="tw-p-3 tw-bg-purple-100 dark:tw-bg-purple-900 tw-rounded-full">
              <UserCog class="tw-w-6 tw-h-6 tw-text-purple-600 dark:tw-text-purple-400" />
            </div>
          </div>
        </div>

        <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-p-4">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">Trạng thái người dùng</p>
              <div class="tw-mt-2">
                <div v-for="(count, status) in tenantStats[tenant.tenant_id]?.usersByStatus || {}" :key="status" class="tw-flex tw-justify-between tw-items-center tw-mb-1">
                  <span class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">{{ formatStatus(status) }}</span>
                  <span class="tw-font-semibold tw-text-gray-800 dark:tw-text-white">{{ count }}</span>
                </div>
              </div>
            </div>
            <div class="tw-p-3 tw-bg-yellow-100 dark:tw-bg-yellow-900 tw-rounded-full">
              <Activity class="tw-w-6 tw-h-6 tw-text-yellow-600 dark:tw-text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin Tenant -->
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-p-4">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-flex tw-items-center tw-gap-4">
            <div>
              <h3 class="tw-text-lg tw-font-semibold tw-text-gray-800 dark:tw-text-white">{{ tenant.name }}</h3>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">{{ tenant.adminUser?.email || '—' }}</p>
            </div>
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
          </div>
          <div class="tw-flex tw-gap-2">
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
          </div>
        </div>
      </div>
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
  Users,
  UserPlus,
  UserCog,
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

interface UserStatistics {
  totalUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  recentUsers: number;
}

const tenants = ref<Tenant[]>([])
const tenantStats = ref<Record<number, UserStatistics>>({})
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

const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    'tenant_admin': 'Quản trị viên',
    'tenant_user': 'Người dùng',
    'tenant_staff': 'Nhân viên',
    'tenant_manager': 'Quản lý'
  };
  return roleMap[role] || role;
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': 'Hoạt động',
    'inactive': 'Tạm dừng',
    'deleted': 'Đã xóa'
  };
  return statusMap[status] || status;
};

const fetchUserStatistics = async (tenantId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/statistics/${tenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Lỗi khi lấy thống kê người dùng');
    }

    const data = await res.json();
    tenantStats.value[tenantId] = data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể lấy thống kê người dùng!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    });
  }
};

const openModal = async (mode: 'view' | 'edit', tenant: Tenant) => {
  modal.value = { open: true, mode, tenant: { ...tenant } };
  if (mode === 'view') {
    await fetchUserStatistics(tenant.tenant_id);
  }
};

const closeModal = () => {
  modal.value.open = false;
};

const fetchTenants = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) throw new Error('Lỗi khi gọi API');
    const data = await res.json();
    tenants.value = data;

    // Fetch statistics for each tenant
    for (const tenant of data) {
      await fetchUserStatistics(tenant.tenant_id);
    }
  } catch (err) {
    console.error('Lỗi khi tải tenants:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể tải danh sách tenant!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    });
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