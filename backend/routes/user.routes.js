const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authentication routes
router.post('/login', controller.login);
router.post('/register', controller.register);

// User management routes (all require authentication)
router.get('/', authMiddleware, controller.getAll);   // GET all users
router.get('/:id', authMiddleware, controller.getById); // GET user by ID
router.post('/', authMiddleware, controller.create); // POST create user
router.put('/:id', authMiddleware, controller.update); // PUT update user
router.delete('/:id', authMiddleware, controller.delete); // DELETE user
router.put('/:id/restore', authMiddleware, controller.restoreCustomer); // Restore user

// Profile management
router.get('/me', authMiddleware, controller.getCurrentUser)

router.get('/', controller.getAll);                  // GET all users
router.get('/:id', controller.getById);              // GET user by ID
router.post('/', controller.create);                 // POST new user
router.put('/:id', controller.update);               // PUT update user
router.put('/profile', authMiddleware, controller.updateProfile);

// Thêm các route quản lý khách hàng cho tenant
router.get('/tenant/:tenant_id', controller.getByTenant); // GET users by tenant_id
router.get('/role/:role', controller.getByRole);     // GET users by role
router.get('/users', authMiddleware, controller.getCustomers);
router.get('/users/:id', authMiddleware, controller.getCustomerById); // Lấy thông tin chi tiết khách hàng
router.put('/users/:id', authMiddleware, controller.updateCustomer);  // Cập nhật thông tin khách hàng
router.delete('/users/:id', authMiddleware, controller.deleteCustomer); // Xóa khách hàng
router.put('/users/:id/restore', authMiddleware, controller.restoreCustomer); // Khôi phục khách hàng

// Thống kê người dùng theo tenant
router.get('/statistics/:tenant_id', authMiddleware, controller.getUserStatistics);

// Thống kê mở rộng cho tenant (bao gồm dung lượng và gói dịch vụ) 
router.get('/extended-statistics/:tenant_id', authMiddleware, controller.getExtendedTenantStatistics);

module.exports = router;
