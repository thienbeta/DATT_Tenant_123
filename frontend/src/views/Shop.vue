<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
      <div class="p-4">
        <div class="relative">
          <button
            @click="isCategoryOpen = !isCategoryOpen"
            class="w-full flex items-center justify-between text-sm font-semibold px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-300"
          >
            <span class="truncate">Danh mục</span>
            <svg
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': isCategoryOpen }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 8l4 4 4-4H6z" />
            </svg>
          </button>
          <transition name="fade">
            <ul v-if="isCategoryOpen" class="mt-2 space-y-1 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2">
              <li
                v-for="category in categories"
                :key="category.category_id"
                class="flex items-center gap-2 text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-200"
                :class="{ 'bg-blue-100 text-blue-700 font-semibold': filters.category === category.category_id }"
                @click="updateCategory(category.category_id); isCategoryOpen = false"
              >
                <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3h12a1 1 0 011 1v3H3V4a1 1 0 011-1zm0 5h14v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                </svg>
                <span class="truncate">{{ category.name }}</span>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
      <!-- Filters -->
      <div class="mb-6">
        <button
          @click="isFilterOpen = !isFilterOpen"
          class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-semibold transition duration-300"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h8a1 1 0 010 2H3a1 1 0 010-2zm0 4h4a1 1 0 010 2H3a1 1 0 010-2z" />
          </svg>
          Bộ lọc
        </button>
        <transition name="fade">
          <div v-if="isFilterOpen" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-lg">
            <div>
              <label class="block text-sm text-gray-700 font-semibold mb-1">Loại gói</label>
              <select
                v-model="filters.package_type"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm p-2.5 transition duration-200"
                @change="fetchPackages"
              >
                <option value="">Tất cả</option>
                <option value="free">Miễn phí</option>
                <option value="pro">Pro</option>
                <option value="vip_pro">VIP Pro</option>
                <option value="enterprise">Doanh nghiệp</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 font-semibold mb-1">Loại dịch vụ</label>
              <select
                v-model="filters.service_type"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm p-2.5 transition duration-200"
                @change="fetchPackages"
              >
                <option value="">Tất cả</option>
                <option value="vps">VPS</option>
                <option value="hosting">Hosting</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 font-semibold mb-1">Danh mục</label>
              <select
                v-model="filters.category"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm p-2.5 transition duration-200"
                @change="fetchPackages"
              >
                <option value="">Tất cả</option>
                <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </transition>
      </div>

      <!-- Service Packages -->
      <div v-if="loading" class="text-center text-gray-600 text-lg flex items-center justify-center">
        <svg class="w-6 h-6 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Đang tải dữ liệu...
      </div>
      <div v-else-if="error" class="text-center text-red-600 text-lg">{{ error }}</div>
      <div v-else-if="packages.length === 0" class="text-center text-gray-600 text-lg">Không tìm thấy gói phù hợp.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="pkg in packages"
          :key="pkg.package_id"
          class="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition duration-300 cursor-pointer relative"
          @click="openModal(pkg)"
        >
          <!-- Badge cho loại gói -->
          <span
            class="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full"
            :class="{
              'bg-green-100 text-green-700': pkg.package_type === 'free',
              'bg-blue-100 text-blue-700': pkg.package_type === 'pro',
              'bg-purple-100 text-purple-700': pkg.package_type === 'vip_pro',
              'bg-yellow-100 text-yellow-700': pkg.package_type === 'enterprise',
            }"
          >
            {{ pkg.package_type === 'free' ? 'Miễn phí' :
               pkg.package_type === 'pro' ? 'Pro' :
               pkg.package_type === 'vip_pro' ? 'VIP Pro' :
               pkg.package_type === 'enterprise' ? 'Doanh nghiệp' : '' }}
          </span>
          <h3 class="text-lg font-bold text-gray-900 mb-2 truncate">{{ pkg.name }}</h3>
          <p class="text-sm text-gray-500 mb-2 truncate">{{ pkg.description }}</p>
          <p class="text-2xl font-bold text-blue-600 mb-2">
            {{ pkg.package_type === 'free' ? 'Miễn phí' : `${formatPrice(pkg.price)}đ` }}
          </p>
          <p class="text-xs text-gray-500 mb-4 capitalize">
            {{ pkg.billing_cycle === 'monthly' ? 'Hàng tháng' :
               pkg.billing_cycle === 'quarterly' ? 'Hàng quý' :
               pkg.billing_cycle === 'yearly' ? 'Hàng năm' :
               pkg.billing_cycle === 'one-time' ? 'Một lần' :
               pkg.billing_cycle === 'indefinite' ? 'Vô thời hạn' : 'Chưa xác định' }}
          </p>
          <ul class="text-sm text-gray-700 space-y-2">
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              Lưu trữ: {{ formatStorage(pkg.file_storage_limit) }}
            </li>
          </ul>
          <button
            class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition duration-300"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <!-- Modal Popup -->
      <transition name="modal">
        <div v-if="modalOpen" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2 transition duration-300"
              title="Đóng"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </button>
            <h2 class="text-xl font-bold text-gray-900 mb-2 truncate">{{ selectedPackage.name }}</h2>
            <span
              class="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-3"
              :class="{
                'bg-green-100 text-green-700': selectedPackage.package_type === 'free',
                'bg-blue-100 text-blue-700': selectedPackage.package_type === 'pro',
                'bg-purple-100 text-purple-700': selectedPackage.package_type === 'vip_pro',
                'bg-yellow-100 text-yellow-700': selectedPackage.package_type === 'enterprise',
              }"
            >
              {{ selectedPackage.package_type === 'free' ? 'Miễn phí' :
                 selectedPackage.package_type === 'pro' ? 'Pro' :
                 selectedPackage.package_type === 'vip_pro' ? 'VIP Pro' :
                 selectedPackage.package_type === 'enterprise' ? 'Doanh nghiệp' : '' }}
            </span>
            <p class="text-sm text-gray-600 mb-2">Danh mục: {{ selectedPackage.category_name || 'Chưa xác định' }}</p>
            <p class="text-sm text-gray-600 mb-2">Mô tả: {{ selectedPackage.description || 'Không có mô tả' }}</p>
            <p class="text-xl font-bold text-blue-600 mb-3">
              {{ selectedPackage.package_type === 'free' ? 'Miễn phí' : `${formatPrice(selectedPackage.price)}đ` }}
            </p>
            <p class="text-xs text-gray-500 mb-4 capitalize">
              {{ selectedPackage.billing_cycle === 'monthly' ? 'Hàng tháng' :
                 selectedPackage.billing_cycle === 'quarterly' ? 'Hàng quý' :
                 selectedPackage.billing_cycle === 'yearly' ? 'Hàng năm' :
                 selectedPackage.billing_cycle === 'one-time' ? 'Một lần' :
                 selectedPackage.billing_cycle === 'indefinite' ? 'Vô thời hạn' : 'Chưa xác định' }}
            </p>
            <ul class="text-sm text-gray-700 space-y-2 mb-6">
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Lưu trữ: {{ formatStorage(selectedPackage.file_storage_limit) }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Trạng thái: {{ selectedPackage.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Ngày tạo: {{ formatDate(selectedPackage.created_at) }}
              </li>
            </ul>
            <div class="border-t border-gray-200 pt-4 mb-4">
              <p class="text-sm font-semibold text-gray-900">Thông tin đơn hàng</p>
              <p class="text-xs text-gray-600">Phí cài đặt: 0đ</p>
              <p class="text-xs text-gray-600">1 năm: {{ selectedPackage.package_type === 'free' ? 'Miễn phí' : `${formatPrice(selectedPackage.price)}đ` }}</p>
              <p class="text-sm font-bold text-gray-900 mt-2">Tổng tiền: {{ selectedPackage.package_type === 'free' ? 'Miễn phí' : `${formatPrice(selectedPackage.price)}đ` }}</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold transition duration-300"
              >
                Hủy
              </button>
              <button
                @click="purchasePackage(selectedPackage.package_id)"
                :disabled="selectedPackage.status !== 'active'"
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const packages = ref([]);
const loading = ref(false);
const error = ref(null);
const filters = ref({
  package_type: '',
  service_type: '',
  category: '',
});
const categories = ref([]);
const isCategoryOpen = ref(false);
const isFilterOpen = ref(false);
const modalOpen = ref(false);
const selectedPackage = ref({});
const urlBase = import.meta.env.VITE_API_URL;

const fetchPackages = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams();
    if (filters.value.package_type) params.append('package_type', filters.value.package_type);
    if (filters.value.service_type) params.append('service_type', filters.value.service_type);
    if (filters.value.category) params.append('category_id', filters.value.category);
    params.append('status', 'active');

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const res = await fetch(`${urlBase}/api/service-packages?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    const { data } = await res.json();

    packages.value = data.map(pkg => ({
      ...pkg,
      billing_cycle: pkg.billing_cycle || 'Chưa xác định',
      file_storage_limit: pkg.file_storage_limit || 'Chưa xác định',
      category_name: categories.value.find(cat => cat.category_id === pkg.category_id)?.name || 'Chưa xác định',
    }));
  } catch (err) {
    error.value = err.message || 'Lỗi khi tải dữ liệu.';
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const res = await fetch(`${urlBase}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    const { data } = await res.json();
    categories.value = data;
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
  }
};

const updateCategory = (categoryId) => {
  filters.value.category = categoryId;
  fetchPackages();
};

const formatPrice = (price) => {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
};

const formatStorage = (limit) => {
  return limit ? `${limit} GB` : 'Chưa xác định';
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Chưa xác định';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const purchasePackage = (id) => {
  alert(`Mua gói có ID: ${id}`);
  modalOpen.value = false;
};

const openModal = (pkg) => {
  selectedPackage.value = pkg;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

onMounted(() => {
  fetchPackages();
  fetchCategories();
});
</script>

<style scoped>
body { font-family: 'Inter', sans-serif; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { transform: scale(0.95); opacity: 0; }
.shadow-lg { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
.transition { transition: all 0.3s ease; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>