<template>
  <div class="tw-p-6">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4 dark:tw-text-white">Quản lý gói dịch vụ</h1>

    <!-- Thanh điều hướng và nút thêm -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <div class="tw-flex tw-gap-4">
        <button @click="currentTab = 'list'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'list', 'tw-bg-gray-200': currentTab !== 'list'}" class="tw-px-4 tw-py-2 tw-rounded">
          Danh sách gói dịch vụ
        </button>
        <button @click="currentTab = 'restore'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'restore', 'tw-bg-gray-200': currentTab !== 'restore'}" class="tw-px-4 tw-py-2 tw-rounded">
          Khôi phục
        </button>
      </div>
      <button v-if="isGlobalAdmin" @click="openCreateModal" class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded tw-flex tw-items-center hover:tw-bg-blue-700">
        <Plus class="tw-w-4 tw-h-4 tw-mr-2" /> Thêm gói dịch vụ
      </button>
    </div>

    <!-- Bảng hiển thị service packages -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Tên gói</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Danh mục</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Giá</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Loại gói</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Chu kỳ</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Giới hạn lưu trữ (bytes)">Lưu trữ (B)</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Giới hạn băng thông (bytes)">Băng thông (B)</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Số lượng cơ sở dữ liệu">Cơ sở dữ liệu</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Số lượng API Calls">API Calls</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="servicePackage in paginatedServicePackages"
            :key="servicePackage.package_id"
            class="tw-border-b dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700"
          >
            <td class="tw-px-4 tw-py-2 tw-text-center">{{ servicePackage.package_id }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.name }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.category_id ? categoriesMap[servicePackage.category_id]?.name || 'Chưa xác định' : '-' }}</td>
            <td class="tw-px-4 tw-py-2">${{ Math.floor(servicePackage.price) }}</td>
            <td class="tw-px-4 tw-py-2">
              {{ servicePackage.package_type === 'free' ? 'Free' :
                 servicePackage.package_type === 'pro' ? 'Pro' :
                 servicePackage.package_type === 'vip_pro' ? 'VIP Pro' :
                 servicePackage.package_type === 'enterprise' ? 'Enterprise' : '' }}
            </td>
            <td class="tw-px-4 tw-py-2">
              {{ servicePackage.billing_cycle === 'monthly' ? 'Hàng tháng' :
                 servicePackage.billing_cycle === 'quarterly' ? 'Hàng quý' :
                 servicePackage.billing_cycle === 'yearly' ? 'Hàng năm' :
                 servicePackage.billing_cycle === 'one-time' ? 'Một lần' :
                 servicePackage.billing_cycle === 'indefinite' ? 'Vô thời hạn' : '' }}
            </td>
            <td class="tw-px-4 tw-py-2">{{ formatBytes(servicePackage.file_storage_limit || 0) }}</td>
            <td class="tw-px-4 tw-py-2">{{ formatBytes(servicePackage.bandwidth_limit || 0) }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.database_limit || 0 }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.api_call_limit || 0 }}</td>
            <td class="tw-px-4 tw-py-2">{{ formatDate(servicePackage.created_at) }}</td>
            <td class="tw-px-4 tw-py-2">
              <span
                :class="[
                  'tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-rounded-full',
                  servicePackage.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  servicePackage.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                  'tw-bg-red-100 tw-text-red-700'
                ]"
              >
                {{ servicePackage.status === 'active' ? 'Hoạt động' :
                   servicePackage.status === 'inactive' ? 'Tạm dừng' :
                   'Đã xóa' }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-2 tw-text-center">
              <div class="tw-flex tw-justify-center tw-gap-2">
                <button @click="openModal('view', servicePackage)" class="tw-text-green-600 hover:tw-text-green-800" title="Xem chi tiết">
                  <Eye class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="openModal('edit', servicePackage)" class="tw-text-[#086df9] hover:tw-text-blue-800" title="Chỉnh sửa">
                  <Edit class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="moveToTrash(servicePackage)" class="tw-text-red-600 hover:tw-text-red-800" title="Xóa vào thùng rác">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'restore'" @click="restoreServicePackage(servicePackage)" class="tw-text-[#086df9] hover:tw-text-blue-800" title="Khôi phục">
                  <RefreshCcw class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'restore'" @click="permanentlyDelete(servicePackage)" class="tw-text-red-600 hover:tw-text-red-800" title="Xóa vĩnh viễn">
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
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, sortedServicePackages.length) }} của {{ sortedServicePackages.length }} gói dịch vụ
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
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-lg tw-p-6 tw-relative tw-max-h-[80vh] tw-overflow-y-auto">
        <button @click="closeModal" class="tw-absolute tw-top-2 tw-right-2 tw-text-[#086df9] hover:tw-text-blue-700" title="Đóng">
          <X class="tw-w-5 tw-h-5" />
        </button>
        <h2 class="tw-text-xl tw-font-bold tw-mb-4 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-2">
            <Info v-if="modal.mode === 'view'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Plus v-if="modal.mode === 'create'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết gói dịch vụ' : modal.mode === 'edit' ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ' }}
        </h2>

        <form @submit.prevent="modal.mode === 'create' ? createServicePackage() : updateServicePackage()">
          <div class="tw-space-y-4">
            <div v-if="modal.mode !== 'create'" class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">ID</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Hash class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="text"
                  disabled
                  :value="modal.servicePackage?.package_id"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Tên gói <span class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Building class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="text"
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.name"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Mô tả</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Info class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <textarea
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.description"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                ></textarea>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Danh mục</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Folder class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select
                  v-model="modal.servicePackage.category_id"
                  :disabled="modal.mode === 'view'"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                >
                  <option value="">Chọn danh mục</option>
                  <option v-for="category in availableCategories" :key="category.category_id" :value="category.category_id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Loại gói <span class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Package class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select
                  v-model="modal.servicePackage.package_type"
                  :disabled="modal.mode === 'view'"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                >
                  <option value="free">Miễn phí</option>
                  <option value="pro">Pro</option>
                  <option value="vip_pro">VIP Pro</option>
                  <option value="enterprise">Doanh nghiệp</option>
                </select>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giá (USD)</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <DollarSign class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  :disabled="modal.mode === 'view' || modal.servicePackage.package_type === 'free'"
                  v-model="modal.servicePackage.price"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Chu kỳ thanh toán <span class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Clock class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select
                  v-model="modal.servicePackage.billing_cycle"
                  :disabled="modal.mode === 'view'"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                >
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                  <option value="one-time">Một lần</option>
                  <option value="indefinite">Vô thời hạn</option>
                </select>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn lưu trữ (B)</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <HardDrive class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.file_storage_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn băng thông (B)</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Network class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.bandwidth_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn cơ sở dữ liệu</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Database class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.database_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn API Calls</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Code class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  :disabled="modal.mode === 'view'"
                  v-model="modal.servicePackage.api_call_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative" v-if="modal.mode !== 'create'">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Calendar class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input
                  type="text"
                  disabled
                  :value="formatDate(modal.servicePackage.created_at)"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Trạng thái <span class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Activity class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select
                  v-model="modal.servicePackage.status"
                  :disabled="modal.mode === 'view'"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="deleted">Đã xóa</option>
                </select>
              </div>
            </div>
          </div>

          <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-2">
            <button
              type="button"
              @click="closeModal"
              class="tw-bg-gray-200 dark:tw-bg-gray-600 tw-text-gray-800 dark:tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-300 dark:hover:tw-bg-gray-500 tw-flex tw-items-center"
            >
              <X class="tw-w-4 tw-h-4 tw-mr-1" /> Đóng
            </button>
            <button
              v-if="modal.mode === 'edit'"
              type="submit"
              class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-800 tw-flex tw-items-center"
            >
              <Save class="tw-w-4 tw-h-4 tw-mr-1" /> Lưu
            </button>
            <button
              v-if="modal.mode === 'create'"
              type="submit"
              class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-800 tw-flex tw-items-center"
            >
              <Plus class="tw-w-4 tw-h-4 tw-mr-1" /> Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import {
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Info,
  Hash,
  Building,
  Calendar,
  Activity,
  X,
  Save,
  RefreshCcw,
  DollarSign,
  Package,
  HardDrive,
  Plus,
  Clock,
  Folder,
  Network,
  Database,
  Code,
} from 'lucide-vue-next';

interface ServicePackage {
  package_id?: number;
  name: string;
  description?: string;
  price: number;
  package_type: 'free' | 'pro' | 'vip_pro' | 'enterprise';
  file_storage_limit?: number;
  bandwidth_limit?: number;
  database_limit?: number;
  api_call_limit?: number;
  start_date?: string | null;
  end_date?: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at?: string;
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time' | 'indefinite';
  category_id?: number;
}

interface Category {
  category_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
  parent_id?: number;
  created_at?: string;
}

const servicePackages = ref<ServicePackage[]>([]);
const categories = ref<Category[]>([]);
const modal = ref<{ open: boolean; mode: 'view' | 'edit' | 'create'; servicePackage: ServicePackage }>({
  open: false,
  mode: 'view',
  servicePackage: {} as ServicePackage,
});
const currentPage = ref(1);
const itemsPerPage = 20;
const currentTab = ref('list');

// Lấy role từ localStorage/sessionStorage
const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const isGlobalAdmin = computed(() => user && user.role === 'global_admin');

// Map categories to quickly look up names by ID
const categoriesMap = computed(() => {
  return categories.value.reduce((map, cat) => {
    map[cat.category_id] = cat;
    return map;
  }, {} as { [key: number]: Category });
});

const availableCategories = computed(() => categories.value.filter(c => c.status !== 'deleted'));

// Format date function
const formatDate = (dateStr?: string): string => {
  if (!dateStr || dateStr === '') return '-';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN');
};

// Format bytes to display only in bytes
const formatBytes = (bytes: number): string => {
  return `${bytes.toFixed(0)} B`;
};

// Lọc service packages dựa trên tab hiện tại
const filteredServicePackages = computed(() => {
  if (currentTab.value === 'list') {
    return servicePackages.value.filter(p => p.status === 'active' || p.status === 'inactive');
  } else {
    return servicePackages.value.filter(p => p.status === 'deleted');
  }
});

// Sắp xếp service packages theo created_at giảm dần
const sortedServicePackages = computed(() =>
  [...filteredServicePackages.value].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  })
);

// Tính toán dữ liệu phân trang
const totalPages = computed(() => Math.ceil(sortedServicePackages.value.length / itemsPerPage));
const paginatedServicePackages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedServicePackages.value.slice(start, end);
});

const openModal = (mode: 'view' | 'edit', servicePackage: ServicePackage) => {
  modal.value = {
    open: true,
    mode,
    servicePackage: {
      ...servicePackage,
      file_storage_limit: servicePackage.file_storage_limit || 0,
      bandwidth_limit: servicePackage.bandwidth_limit || 0,
      database_limit: servicePackage.database_limit || 0,
      api_call_limit: servicePackage.api_call_limit || 0,
      start_date: null,
      end_date: null,
    },
  };
};

const openCreateModal = () => {
  modal.value = {
    open: true,
    mode: 'create',
    servicePackage: {
      name: '',
      description: '',
      price: 0,
      package_type: 'free',
      file_storage_limit: 0,
      bandwidth_limit: 0,
      database_limit: 0,
      api_call_limit: 0,
      start_date: null,
      end_date: null,
      status: 'active',
      billing_cycle: 'indefinite',
      category_id: undefined,
    },
  };
};

const closeModal = () => {
  modal.value.open = false;
};

// Theo dõi thay đổi package_type để điều chỉnh giá
watch(() => modal.value.servicePackage.package_type, (newType) => {
  if (newType === 'free') {
    modal.value.servicePackage.price = 0;
  }
});

const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const fetchServicePackages = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách gói dịch vụ');
    const { data } = await res.json();
    servicePackages.value = data.map((pkg: ServicePackage) => ({
      ...pkg,
      file_storage_limit: Number(pkg.file_storage_limit) || 0,
      bandwidth_limit: Number(pkg.bandwidth_limit) || 0,
      database_limit: Number(pkg.database_limit) || 0,
      api_call_limit: Number(pkg.api_call_limit) || 0,
    }));
  } catch (err) {
    console.error('Lỗi khi tải gói dịch vụ:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tải danh sách gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  }
};

const fetchCategories = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách danh mục');
    const { data } = await res.json();
    categories.value = data;
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tải danh sách danh mục!',
      confirmButtonColor: '#086df9',
    });
  }
};

const validateServicePackage = (pkg: ServicePackage): string | null => {
  if (!pkg.name.trim()) return 'Tên gói dịch vụ là bắt buộc';
  if (!pkg.package_type) return 'Loại gói dịch vụ là bắt buộc';
  if (!pkg.billing_cycle) return 'Chu kỳ thanh toán là bắt buộc';
  if (!pkg.status) return 'Trạng thái là bắt buộc';
  if (pkg.price < 0) return 'Giá không thể âm';
  if (pkg.file_storage_limit && pkg.file_storage_limit < 0) return 'Giới hạn lưu trữ không thể âm';
  if (pkg.bandwidth_limit && pkg.bandwidth_limit < 0) return 'Giới hạn băng thông không thể âm';
  if (pkg.database_limit && pkg.database_limit < 0) return 'Giới hạn cơ sở dữ liệu không thể âm';
  if (pkg.api_call_limit && pkg.api_call_limit < 0) return 'Giới hạn API calls không thể âm';
  return null;
};

const createServicePackage = async () => {
  const validationError = validateServicePackage(modal.value.servicePackage);
  if (validationError) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: validationError,
      confirmButtonColor: '#086df9',
    });
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...modal.value.servicePackage,
        category_id: modal.value.servicePackage.category_id || null,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Không thể tạo gói dịch vụ');
    }
    await fetchServicePackages();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Tạo gói dịch vụ thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi tạo:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tạo gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  }
};

const updateServicePackage = async () => {
  const validationError = validateServicePackage(modal.value.servicePackage);
  if (validationError) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: validationError,
      confirmButtonColor: '#086df9',
    });
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages/${modal.value.servicePackage.package_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...modal.value.servicePackage,
        category_id: modal.value.servicePackage.category_id || null,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Không thể cập nhật gói dịch vụ');
    }
    await fetchServicePackages();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật gói dịch vụ thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể cập nhật gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  }
};

const moveToTrash = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển gói dịch vụ ${servicePackage.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const updatedPackage = { ...servicePackage, status: 'deleted' };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPackage),
      });
      if (!res.ok) throw new Error('Không thể chuyển gói dịch vụ');
      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã được chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể chuyển gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

const restoreServicePackage = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục gói dịch vụ ${servicePackage.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const updatedPackage = { ...servicePackage, status: 'active' };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPackage),
      });
      if (!res.ok) throw new Error('Không thể khôi phục gói dịch vụ');
      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã được khôi phục!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể khôi phục gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

const permanentlyDelete = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa vĩnh viễn',
    text: `Bạn có chắc muốn xóa vĩnh viễn gói dịch vụ ${servicePackage.name}? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Không thể xóa gói dịch vụ');
      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã được xóa vĩnh viễn!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi xóa:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể xóa gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

onMounted(() => {
  fetchServicePackages();
  fetchCategories();
});
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #086df9;
  box-shadow: 0 0 0 3px rgba(8, 109, 249, 0.3);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

@media (max-width: 768px) {
  .tw-overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>