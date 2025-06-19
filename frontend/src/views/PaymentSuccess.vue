<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div class="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float-delayed"></div>
      <div class="absolute bottom-32 left-40 w-28 h-28 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
    </div>

    <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20">
      <!-- Success Icon with animation -->
      <div class="mb-6 relative">
        <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center animate-bounce-in">
          <svg class="w-10 h-10 text-white animate-check-mark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <!-- Pulse effect -->
        <div class="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto animate-pulse-ring"></div>
      </div>

      <!-- Success Message -->
      <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 animate-fade-in">
        Thanh toán thành công!
      </h1>

      <!-- Celebration emoji -->
      <div class="text-4xl mb-4 animate-bounce">🎉</div>

      <!-- Package Info -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <p class="text-gray-700 mb-3 text-lg">
          Cảm ơn bạn đã mua gói:
        </p>
        <p class="text-2xl font-bold text-indigo-700 mb-4">{{ packageName }}</p>
        
        <div class="flex items-center justify-center mb-3">
          <span class="text-sm text-gray-500 mr-2">Tổng tiền:</span>
          <span class="text-2xl font-bold text-green-600">{{ formatPrice(price) }}đ</span>
        </div>
        
        <div class="flex items-center justify-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Mã đơn hàng: {{ purchaseId }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="goHome"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transform transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Về trang chủ
          </span>
        </button>
        
        <button
          @click="downloadReceipt"
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
        >
          <span class="flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Tải hóa đơn
          </span>
        </button>
      </div>

      <!-- Thank you message -->
      <p class="text-sm text-gray-500 mt-6 italic">
        Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi! ❤️
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const purchaseId = ref('');
const packageName = ref('');
const price = ref(0);

const formatPrice = (price) => {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
};

const goHome = () => {
  router.push('/');
};

const downloadReceipt = () => {
    window.location.href = `http://localhost:3000/api/user-purchases/invoice-pdf/${purchaseId.value}`;
  console.log('Downloading receipt...');
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  purchaseId.value = urlParams.get('purchase_id') || 'PH' + Date.now();
  packageName.value = decodeURIComponent(urlParams.get('package_name') || 'Gói Premium');
  price.value = parseFloat(urlParams.get('price') || 299000);
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes check-mark {
  0% { stroke-dasharray: 0, 100; }
  100% { stroke-dasharray: 100, 0; }
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

.animate-check-mark {
  stroke-dasharray: 100;
  animation: check-mark 0.8s ease-out 0.3s both;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out 0.5s both;
}
</style>