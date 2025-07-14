import axios from 'axios';

// Cache để tránh gửi dữ liệu trùng lặp
let lastReportedSize = 0;
let isReporting = false;

export async function reportBandwidthUsage(user, packageId) {
  // Chỉ gọi một lần khi trang load xong
  if (isReporting || !user || !packageId || user.role === 'global_admin') {
    return;
  }

  isReporting = true;

  setTimeout(async () => {
    try {
      const entries = performance.getEntriesByType('resource');
      let total = 0;
      
      // Chỉ tính các resource liên quan đến API và file upload/download
      entries.forEach(e => {
        if (e.transferSize && (
          e.name.includes('/api/') || 
          e.name.includes('/file-upload/') ||
          e.name.includes('/serve/')
        )) {
          total += e.transferSize;
        }
      });

      // Chỉ gửi nếu có thay đổi đáng kể (> 1KB)
      if (total > lastReportedSize + 1024) {
        console.log('Gửi bandwidth:', { 
          user: user.user_id, 
          packageId, 
          total, 
          difference: total - lastReportedSize 
        });

        await axios.post('http://localhost:3000/api/usage/bandwidth', {
          tenant_id: user.tenant_id,
          user_id: user.user_id,
          package_id: packageId,
          bandwidth_used: total - lastReportedSize // Chỉ gửi phần tăng thêm
        });

        lastReportedSize = total;
      }
    } catch (error) {
      console.error('Lỗi khi gửi bandwidth:', error);
    } finally {
      isReporting = false;
    }
  }, 3000); // Tăng thời gian chờ để đảm bảo trang load xong
} 