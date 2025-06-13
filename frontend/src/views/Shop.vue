<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r shadow-sm overflow-y-auto">
      <div class="p-4">
        <div class="relative">
          <button
            @click="isCategoryOpen = !isCategoryOpen"
            class="w-full flex items-center justify-between text-sm font-medium px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200"
          >
            <span class="truncate">Danh mục</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
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
    <main class="flex-1 p-6 overflow-y-auto">
      <!-- Filters -->
      <div class="mb-6">
        <button
          @click="isFilterOpen = !isFilterOpen"
          class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium transition duration-200"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h8a1 1 0 010 2H3a1 1 0 010-2zm0 4h4a1 1 0 010 2H3a1 1 0 010-2z" />
          </svg>
          Bộ lọc
        </button>
        <transition name="fade">
          <div v-if="isFilterOpen" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-glow">
            <div>
              <label class="block text-sm text-gray-700 font-medium mb-1">Loại gói</label>
              <select
                v-model="filters.package_type"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 transition duration-200"
                @change="fetchPackages"
              >
                <option value="">Tất cả</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="vip_pro">VIP Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 font-medium mb-1">Loại dịch vụ</label>
              <select
                v-model="filters.service_type"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 transition duration-200"
                @change="fetchPackages"
              >
                <option value="">Tất cả</option>
                <option value="vps">VPS</option>
                <option value="hosting">Hosting</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 font-medium mb-1">Danh mục</label>
              <select
                v-model="filters.category"
                class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 transition duration-200"
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
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          class="bg-white border border-gray-200 rounded-xl shadow-glow p-5 hover-scale transition duration-200 cursor-pointer"
          @click="openModal(pkg)"
        >
          <h3 class="text-xl font-semibold text-gray-900 mb-2 truncate">{{ pkg.name }}</h3>
          <p class="text-2xl font-bold text-red-600 mb-2">{{ formatPrice(pkg.price) }}đ</p>
          <p class="text-xs text-gray-500 mb-3">{{ pkg.billing_cycle }}</p>
          <ul class="text-sm text-gray-700 space-y-2 mb-4">
            <li v-if="pkg.cpu" class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              CPU: {{ pkg.cpu }}
            </li>
            <li v-if="pkg.ram" class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              RAM: {{ pkg.ram }}
            </li>
            <li v-if="pkg.storage" class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              Storage: {{ pkg.file_storage_limit }}
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              Băng thông: {{ pkg.bandwidth_limit }}
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              Mạng: {{ pkg.network }}
            </li>
            <li v-if="pkg.database_limit" class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              Cơ sở dữ liệu: {{ pkg.database_limit }}
            </li>
            <li v-if="pkg.api_call_limit" class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
              </svg>
              API Call: {{ pkg.api_call_limit }}
            </li>
          </ul>
          <button
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition duration-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <!-- Modal Popup -->
      <transition name="modal">
        <div v-if="modalOpen" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2 transition duration-200"
              title="Đóng"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
              </svg>
            </button>
            <h2 class="text-2xl font-bold text-gray-900 mb-3 truncate">{{ selectedPackage.name }}</h2>
            <p class="text-sm text-gray-600 mb-2">Danh mục: {{ selectedPackage.category_name || 'Chưa xác định' }}</p>
            <p class="text-xl font-bold text-red-600 mb-2">{{ formatPrice(selectedPackage.price) }}đ</p>
            <p class="text-xs text-gray-500 mb-3">{{ selectedPackage.billing_cycle }}</p>
            <ul class="text-sm text-gray-700 space-y-2 mb-4">
              <li v-if="selectedPackage.cpu" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                CPU: {{ selectedPackage.cpu }}
              </li>
              <li v-if="selectedPackage.ram" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                RAM: {{ selectedPackage.ram }}
              </li>
              <li v-if="selectedPackage.storage" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Storage: {{ selectedPackage.file_storage_limit }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Băng thông: {{ selectedPackage.bandwidth_limit }}
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Mạng: {{ selectedPackage.network }}
              </li>
              <li v-if="selectedPackage.database_limit" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                Cơ sở dữ liệu: {{ selectedPackage.database_limit }}
              </li>
              <li v-if="selectedPackage.api_call_limit" class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2z" clip-rule="evenodd" />
                </svg>
                API Call: {{ selectedPackage.api_call_limit }}
              </li>
            </ul>
            <div class="border-t border-gray-200 pt-4 mb-4">
  <h3 class="text-sm font-semibold text-gray-900 mb-2">Thông tin đơn hàng</h3>
  <p class="text-xs text-gray-600"><strong>Tên gói:</strong> {{ selectedPackage.name || 'Chưa xác định' }}</p>
  <p class="text-xs text-gray-600"><strong>Loại gói:</strong> {{ selectedPackage.package_type || 'Chưa xác định' }}</p>
  <p class="text-xs text-gray-600"><strong>Loại dịch vụ:</strong> {{ selectedPackage.service_type || 'Chưa xác định' }}</p>
  <p class="text-xs text-gray-600"><strong>Chu kỳ thanh toán:</strong> {{ selectedPackage.billing_cycle || 'Chưa xác định' }}</p>
  <p class="text-xs text-gray-600"><strong>Phí cài đặt:</strong> 0đ</p>
  <p class="text-xs text-gray-600"><strong>Giá:</strong> {{ formatPrice(selectedPackage.price) }}đ</p>
  <p v-if="selectedPackage.file_storage_limit" class="text-xs text-gray-600"><strong>Giới hạn lưu trữ:</strong> {{ formatStorage(selectedPackage.file_storage_limit) }}</p>
  <p v-if="selectedPackage.bandwidth_limit" class="text-xs text-gray-600"><strong>Giới hạn băng thông:</strong> {{ formatStorage(selectedPackage.bandwidth_limit) }}</p>
  <p v-if="selectedPackage.database_limit" class="text-xs text-gray-600"><strong>Giới hạn cơ sở dữ liệu:</strong> {{ formatStorage(selectedPackage.database_limit) }}</p>
  <p v-if="selectedPackage.api_call_limit" class="text-xs text-gray-600"><strong>Giới hạn API Call:</strong> {{ selectedPackage.api_call_limit }}</p>
  <p class="text-sm font-bold text-gray-900 mt-2">Tổng tiền: {{ formatPrice(selectedPackage.price) }}đ</p>
</div>
            <transition name="fade">
              <div v-if="showPaymentForm" class="mt-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Thông tin thanh toán</h3>
                <div class="mb-4">
                  <label class="block text-sm text-gray-700 font-medium mb-1">Phương thức thanh toán</label>
                  <select v-model="paymentMethod" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2 transition duration-200">
                    <option value="paypal">PayPal</option>
                    <!-- Thêm các phương thức khác nếu cần -->
                  </select>
                </div>
                <button
                  @click="processPayment"
                  class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition duration-200"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </transition>
            <div v-if="!showPaymentForm" class="flex gap-3">
              <button
                @click="closeModal"
                class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium transition duration-200"
              >
                Hủy
              </button>
              <button
                @click="showPaymentForm = true"
                :disabled="selectedPackage.status !== 'active'"
                class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
import { toast } from 'vue3-toastify';

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
const showPaymentForm = ref(false);
const paymentMethod = ref('paypal');
const urlBase = import.meta.env.VITE_API_URL;

const checkPaymentStatus = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('paymentId');
  const payerId = urlParams.get('PayerID');

  if (paymentId && payerId) {
    try {
      const token = sessionStorage.getItem('token') ||
        document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1] ||
        localStorage.getItem('token');

      const response = await fetch(`${urlBase}/api/user-purchases/paypal/success?paymentId=${paymentId}&PayerID=${payerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Không thể xác nhận thanh toán');
      }

      const result = await response.json();
      // Hiển thị thông báo thành công
      toast.success(`Thanh toán thành công cho gói ${result.package_name}! Tổng tiền: ${formatPrice(result.price)}đ`, {
        timeout: 5000,
      });

      // Xóa query params khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Lỗi xác nhận thanh toán:', error);
      toast.error(`Lỗi khi xác nhận thanh toán: ${error.message}`);
    }
  }
};

const fetchPackages = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams();
    if (filters.value.package_type) params.append('package_type', filters.value.package_type);
    if (filters.value.service_type) params.append('service_type', filters.value.service_type);
    if (filters.value.category) params.append('category_id', filters.value.category);
    params.append('status', 'active');

    const res = await fetch(`${urlBase}/api/service-packages?${params.toString()}`);
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    const data = await res.json();

    packages.value = data.data.map(pkg => ({
      id: pkg.package_id,
      name: pkg.name,
      price: pkg.price,
      billing_cycle: pkg.billing_cycle || 'Chưa xác định',
      package_type: pkg.package_type,
      service_type: pkg.service_type,
      file_storage_limit: pkg.file_storage_limit || 'Chưa xác định',
      bandwidth_limit: pkg.bandwidth_limit || 'Chưa xác định',
      database_limit: pkg.database_limit || 'Chưa xác định',
      api_call_limit: pkg.api_call_limit || 'Chưa xác định',
      category_name: categories.value.find(cat => cat.category_id === pkg.category_id)?.name || 'Chưa xác định',
      status: pkg.status || 'pedning',
      hostname: pkg.hostname || 'interdata1749627983',
      root_password: pkg.root_password || 'Mật khẩu Root',
      os: pkg.os || 'WPTangToc-OLS-6.4.2',
    }));
  } catch (err) {
    error.value = err.message || 'Lỗi khi tải dữ liệu.';
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch(`${urlBase}/api/categories`);
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    const data = await res.json();
    categories.value = data.data;
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

const formatStorage = (bytes) => {
  if (bytes === 0) return 'Không giới hạn';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const processPayment = async () => {
  if (paymentMethod.value === 'paypal') {
    let user;
    try {
      const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      const tokenFromSessionStorage = sessionStorage.getItem('token');
      const tokenFromLocalStorage = localStorage.getItem('token');
      const token = tokenFromSessionStorage || tokenFromCookie || tokenFromLocalStorage;

      console.log('Token found:', !!token);
      console.log('Making request to:', `${urlBase}/api/users/me`);

      const response = await fetch(`${urlBase}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response for /api/users/me:', errorText);

        if (response.status === 401 || response.status === 404) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          sessionStorage.removeItem('token');
          localStorage.removeItem('token');
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/login';
          return;
        }

        throw new Error(`Failed to fetch user info: ${response.status} - ${errorText}`);
      }

      user = await response.json();
      console.log('User info from server:', user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert('Vui lòng đăng nhập để tiếp tục.');
      return;
    }

    if (!user?.user_id || !user?.tenant_id) {
      console.error('Missing required fields:', {
        user_id: user?.user_id,
        tenant_id: user?.tenant_id,
      });
      alert('Thông tin người dùng không đầy đủ. Vui lòng đăng nhập lại.');
      return;
    }

    // Kiểm tra selectedPackage
    if (!selectedPackage.value || !selectedPackage.value.id) {
      alert('Vui lòng chọn một gói trước khi thanh toán.');
      return;
    }

    try {
      console.log('Creating purchase with:', {
        user_id: user.user_id,
        package_id: selectedPackage.value.id,
        tenant_id: user.tenant_id,
        start_date: new Date().toISOString(),
      });

      const token = sessionStorage.getItem('token') ||
        document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1] ||
        localStorage.getItem('token');

      const createPurchaseResponse = await fetch(`${urlBase}/api/user-purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.user_id,
          package_id: selectedPackage.value.id,
          tenant_id: user.tenant_id,
          status: 'pending',
          start_date: new Date().toISOString(),
        }),
      });

      if (!createPurchaseResponse.ok) {
        const errorText = await createPurchaseResponse.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to create purchase: ${createPurchaseResponse.status} - ${errorText}`);
      }

      const purchaseData = await createPurchaseResponse.json();
      const purchaseId = purchaseData.purchase_id;

      const payPalResponse = await fetch(`${urlBase}/api/user-purchases/paypal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify({ purchaseId }),
      });

      if (!payPalResponse.ok) {
        const errorText = await payPalResponse.text();
        console.error('PayPal error:', errorText);
        throw new Error('Failed to create PayPal order');
      }

      const payPalData = await payPalResponse.json();
      if (payPalData.approval_url) {
        window.location.href = payPalData.approval_url;
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert(`Lỗi khi thanh toán: ${error.message}`);
    }
  }
  showPaymentForm.value = false;
};

const openModal = (pkg) => {
  selectedPackage.value = pkg;
  console.log('Selected package:', selectedPackage.value);
  console.log('Selected package details:', {
    id: selectedPackage.value.id,
    name: selectedPackage.value.name,
    status: selectedPackage.value.status,
  });
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  showPaymentForm.value = false;
};

onMounted(() => {
  fetchPackages();
  fetchCategories();
  checkPaymentStatus();
});
</script>

<style scoped>
body { font-family: 'Inter', sans-serif; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { transform: scale(0.95); opacity: 0; }
.shadow-glow { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15); }
.hover-scale:hover { transform: scale(1.02); transition: transform 0.2s ease; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>