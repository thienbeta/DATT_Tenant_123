<template>
  <div class="tw-p-6">
    <!-- Header -->
    <div class="tw-mb-6">
      <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">Quản lý mua hàng</h1>
      <p class="tw-text-gray-600 dark:tw-text-gray-400">Theo dõi tất cả giao dịch mua hàng và dung lượng sử dụng</p>
    </div>

    <!-- Statistics Cards -->
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6 tw-mb-6">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
        <div class="tw-flex tw-items-center">
          <div class="tw-p-2 tw-bg-blue-100 dark:tw-bg-blue-900 tw-rounded-lg">
            <ShoppingCart class="tw-w-6 tw-h-6 tw-text-blue-600 dark:tw-text-blue-400" />
          </div>
          <div class="tw-ml-4">
            <p class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-400">Tổng đơn hàng</p>
            <p class="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{{ statistics.overview?.totalPurchases || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
        <div class="tw-flex tw-items-center">
          <div class="tw-p-2 tw-bg-green-100 dark:tw-bg-green-900 tw-rounded-lg">
            <CheckCircle class="tw-w-6 tw-h-6 tw-text-green-600 dark:tw-text-green-400" />
          </div>
          <div class="tw-ml-4">
            <p class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-400">Đã hoàn thành</p>
            <p class="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{{ statistics.overview?.completedPurchases || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
        <div class="tw-flex tw-items-center">
          <div class="tw-p-2 tw-bg-yellow-100 dark:tw-bg-yellow-900 tw-rounded-lg">
            <Clock class="tw-w-6 tw-h-6 tw-text-yellow-600 dark:tw-text-yellow-400" />
          </div>
          <div class="tw-ml-4">
            <p class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-400">Đang chờ</p>
            <p class="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{{ statistics.overview?.pendingPurchases || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
        <div class="tw-flex tw-items-center">
          <div class="tw-p-2 tw-bg-red-100 dark:tw-bg-red-900 tw-rounded-lg">
            <DollarSign class="tw-w-6 tw-h-6 tw-text-red-600 dark:tw-text-red-400" />
          </div>
          <div class="tw-ml-4">
            <p class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-400">Doanh thu</p>
            <p class="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{{ formatPrice(statistics.overview?.totalRevenue || 0) }}đ</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6 tw-mb-6">
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4">
        <div>
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">Tìm kiếm</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Tên hoặc email người dùng..."
            class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-text-white"
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">Trạng thái</label>
          <select
            v-model="filters.status"
            class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-text-white"
            @change="fetchPurchases"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang chờ</option>
            <option value="completed">Hoàn thành</option>
            <option value="failed">Thất bại</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </div>
        <div>
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-2">Số lượng hiển thị</label>
          <select
            v-model="filters.limit"
            class="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 dark:tw-bg-gray-700 dark:tw-text-white"
            @change="fetchPurchases"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class="tw-flex tw-items-end">
          <button
            @click="fetchPurchases"
            class="tw-w-full tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors"
          >
            <RefreshCw class="tw-w-4 tw-h-4 tw-inline tw-mr-2" />
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-overflow-hidden">
      <div class="tw-overflow-x-auto">
        <table class="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
          <thead class="tw-bg-gray-50 dark:tw-bg-gray-700">
            <tr>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Người mua
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Gói dịch vụ
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Giá
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Dung lượng sử dụng
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Trạng thái
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Ngày mua
              </th>
              <th class="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
            <tr v-if="loading" class="tw-text-center">
              <td colspan="7" class="tw-px-6 tw-py-4">
                <div class="tw-flex tw-items-center tw-justify-center">
                  <Loader2 class="tw-w-6 tw-h-6 tw-animate-spin tw-mr-2" />
                  Đang tải dữ liệu...
                </div>
              </td>
            </tr>
            <tr v-else-if="purchases.length === 0" class="tw-text-center">
              <td colspan="7" class="tw-px-6 tw-py-4 tw-text-gray-500 dark:tw-text-gray-400">
                Không có dữ liệu
              </td>
            </tr>
            <tr v-for="purchase in purchases" :key="purchase.purchase_id" class="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <div>
                  <div class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                    {{ purchase.user?.full_name || 'N/A' }}
                  </div>
                  <div class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                    {{ purchase.user?.email || 'N/A' }}
                  </div>
                  <div class="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500">
                    {{ purchase.tenant?.name || 'N/A' }}
                  </div>
                </div>
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <div>
                  <div class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                    {{ purchase.package?.name || 'N/A' }}
                  </div>
                  <div class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                    {{ purchase.package?.package_type || 'N/A' }} - {{ purchase.package?.service_type || 'N/A' }}
                  </div>
                  <div class="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500">
                    {{ purchase.package?.billing_cycle || 'N/A' }}
                  </div>
                </div>
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <div class="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white">
                  {{ formatPrice(purchase.package?.price || 0) }}đ
                </div>
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <div class="tw-w-full">
                  <div class="tw-flex tw-justify-between tw-text-sm tw-mb-1">
                    <span class="tw-text-gray-600 dark:tw-text-gray-400">
                      {{ formatStorage(purchase.usage?.used || 0) }}
                    </span>
                    <span class="tw-text-gray-600 dark:tw-text-gray-400">
                      {{ formatStorage(purchase.usage?.limit || 0) }}
                    </span>
                  </div>
                  <div class="tw-w-full tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded-full tw-h-2">
                    <div
                      class="tw-h-2 tw-rounded-full tw-transition-all tw-duration-300"
                      :class="getUsageColor(purchase.usage?.percentage || 0)"
                      :style="{ width: `${Math.min(purchase.usage?.percentage || 0, 100)}%` }"
                    ></div>
                  </div>
                  <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1">
                    {{ purchase.usage?.percentage || 0 }}% sử dụng
                  </div>
                </div>
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <span
                  class="tw-inline-flex tw-px-2 tw-py-1 tw-text-xs tw-font-semibold tw-rounded-full"
                  :class="getStatusColor(purchase.status)"
                >
                  {{ getStatusText(purchase.status) }}
                </span>
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                {{ formatDate(purchase.purchase_date) }}
              </td>
              <td class="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                <button
                  @click="viewDetails(purchase)"
                  class="tw-text-blue-600 hover:tw-text-blue-900 dark:tw-text-blue-400 dark:hover:tw-text-blue-300 tw-mr-3"
                >
                  Chi tiết
                </button>
                <button
                  @click="viewUsageDetails(purchase)"
                  class="tw-text-green-600 hover:tw-text-green-900 dark:tw-text-green-400 dark:hover:tw-text-green-300 tw-mr-3"
                >
                  Dung lượng
                </button>
                <button
                  v-if="purchase.status === 'completed'"
                  @click="sendInvoice(purchase.purchase_id)"
                  class="tw-text-purple-600 hover:tw-text-purple-900 dark:tw-text-purple-400 dark:hover:tw-text-purple-300"
                >
                  Gửi hóa đơn
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-px-4 tw-py-3 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 sm:tw-px-6">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div class="tw-flex-1 tw-flex tw-justify-between sm:tw-hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-medium tw-rounded-md tw-text-gray-700 tw-bg-white hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              Trước
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="tw-ml-3 tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-text-sm tw-font-medium tw-rounded-md tw-text-gray-700 tw-bg-white hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div class="tw-hidden sm:tw-flex-1 sm:tw-flex sm:tw-items-center sm:tw-justify-between">
            <div>
              <p class="tw-text-sm tw-text-gray-700 dark:tw-text-gray-300">
                Hiển thị
                <span class="tw-font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                đến
                <span class="tw-font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                trong tổng số
                <span class="tw-font-medium">{{ pagination.total }}</span>
                kết quả
              </p>
            </div>
            <div>
              <nav class="tw-relative tw-z-0 tw-inline-flex tw-rounded-md tw-shadow-sm -tw-space-x-px">
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="tw-relative tw-inline-flex tw-items-center tw-px-2 tw-py-2 tw-rounded-l-md tw-border tw-border-gray-300 tw-bg-white tw-text-sm tw-font-medium tw-text-gray-500 hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                >
                  <ChevronLeft class="tw-w-5 tw-h-5" />
                </button>
                <button
                  v-for="page in getPageNumbers()"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-text-sm tw-font-medium',
                    page === pagination.page
                      ? 'tw-z-10 tw-bg-blue-50 tw-border-blue-500 tw-text-blue-600'
                      : 'tw-bg-white tw-border-gray-300 tw-text-gray-500 hover:tw-bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="tw-relative tw-inline-flex tw-items-center tw-px-2 tw-py-2 tw-rounded-r-md tw-border tw-border-gray-300 tw-bg-white tw-text-sm tw-font-medium tw-text-gray-500 hover:tw-bg-gray-50 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                >
                  <ChevronRight class="tw-w-5 tw-h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-z-50">
      <div class="tw-relative tw-top-20 tw-mx-auto tw-p-5 tw-border tw-w-96 tw-shadow-lg tw-rounded-md tw-bg-white dark:tw-bg-gray-800">
        <div class="tw-mt-3">
          <h3 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white tw-mb-4">Chi tiết đơn hàng</h3>
          <div class="tw-space-y-3">
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Người mua:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ selectedPurchase?.user?.full_name }}</p>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">{{ selectedPurchase?.user?.email }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Gói dịch vụ:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ selectedPurchase?.package?.name }}</p>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">{{ selectedPurchase?.package?.package_type }} - {{ selectedPurchase?.package?.service_type }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Giá:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ formatPrice(selectedPurchase?.package?.price || 0) }}đ</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Dung lượng sử dụng:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">
                {{ formatStorage(selectedPurchase?.usage?.used || 0) }} / {{ formatStorage(selectedPurchase?.usage?.limit || 0) }}
              </p>
              <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                {{ selectedPurchase?.usage?.percentage || 0 }}% sử dụng
              </p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Trạng thái:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ getStatusText(selectedPurchase?.status) }}</p>
            </div>
            <div>
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Ngày mua:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ formatDate(selectedPurchase?.purchase_date) }}</p>
            </div>
            <div v-if="selectedPurchase?.start_date">
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Ngày bắt đầu:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ formatDate(selectedPurchase?.start_date) }}</p>
            </div>
            <div v-if="selectedPurchase?.end_date">
              <label class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">Ngày kết thúc:</label>
              <p class="tw-text-sm tw-text-gray-900 dark:tw-text-white">{{ formatDate(selectedPurchase?.end_date) }}</p>
            </div>
          </div>
          <div class="tw-flex tw-justify-end tw-space-x-3 tw-mt-6">
            <button
              @click="showDetailModal = false"
              class="tw-px-4 tw-py-2 tw-bg-gray-300 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Details Modal -->
    <UsageDetailsModal
      :show="showUsageModal"
      :user-info="selectedPurchase?.user"
      :package-info="selectedPurchase?.package"
      :tenant-info="selectedPurchase?.tenant"
      :user-id="selectedPurchase?.user?.user_id"
      @close="showUsageModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import UsageDetailsModal from '../components/UsageDetailsModal.vue'
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const purchases = ref([])
const loading = ref(false)
const statistics = ref({})
const filters = ref({
  search: '',
  status: 'all',
  limit: 10
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})
const showDetailModal = ref(false)
const showUsageModal = ref(false)
const selectedPurchase = ref(null)
const urlBase = import.meta.env.VITE_API_URL

// Debounce search
let searchTimeout
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchPurchases()
  }, 500)
}

const fetchPurchases = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: filters.value.limit,
      status: filters.value.status,
      ...(filters.value.search && { search: filters.value.search })
    })

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${urlBase}/api/user-purchases/admin/all-purchases?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Lỗi khi tải dữ liệu')

    const data = await response.json()
    purchases.value = data.data
    pagination.value = data.pagination
  } catch (error) {
    console.error('Error fetching purchases:', error)
    toast.error('Lỗi khi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${urlBase}/api/user-purchases/admin/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Lỗi khi tải thống kê')

    const data = await response.json()
    statistics.value = data
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchPurchases()
  }
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.page
  const total = pagination.value.totalPages

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
}

const viewDetails = (purchase) => {
  selectedPurchase.value = purchase
  showDetailModal.value = true
}

const viewUsageDetails = (purchase) => {
  selectedPurchase.value = purchase
  showUsageModal.value = true
}

const sendInvoice = async (purchaseId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${urlBase}/api/user-purchases/invoice/${purchaseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Lỗi khi gửi hóa đơn')

    toast.success('Hóa đơn đã được gửi thành công')
  } catch (error) {
    console.error('Error sending invoice:', error)
    toast.error('Lỗi khi gửi hóa đơn')
  }
}

const formatPrice = (price) => {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
}

const formatStorage = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'tw-bg-yellow-100 tw-text-yellow-800 dark:tw-bg-yellow-900 dark:tw-text-yellow-200',
    completed: 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-200',
    failed: 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-200',
    canceled: 'tw-bg-gray-100 tw-text-gray-800 dark:tw-bg-gray-900 dark:tw-text-gray-200',
    active: 'tw-bg-blue-100 tw-text-blue-800 dark:tw-bg-blue-900 dark:tw-text-blue-200',
    inactive: 'tw-bg-gray-100 tw-text-gray-800 dark:tw-bg-gray-900 dark:tw-text-gray-200'
  }
  return colors[status] || colors.inactive
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Đang chờ',
    completed: 'Hoàn thành',
    failed: 'Thất bại',
    canceled: 'Đã hủy',
    active: 'Hoạt động',
    inactive: 'Không hoạt động'
  }
  return texts[status] || status
}

const getUsageColor = (percentage) => {
  if (percentage >= 90) return 'tw-bg-red-500'
  if (percentage >= 70) return 'tw-bg-yellow-500'
  return 'tw-bg-green-500'
}

onMounted(() => {
  fetchPurchases()
  fetchStatistics()
})
</script> 