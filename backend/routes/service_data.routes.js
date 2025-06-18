const express = require('express');
const router = express.Router();
const controller = require('../controllers/service_data.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole, checkTenantAccess } = require('../middleware/rbac.middleware');

// Áp dụng middleware xác thực cho tất cả routes
router.use(authMiddleware);

// Routes thống kê (phải đặt trước routes với parameter)
router.get('/stats/tenant', checkRole(['global_admin', 'tenant_admin']), controller.getTenantStats);
router.get('/stats/user', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.getUserStats);
router.get('/stats/user/:userId', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.getUserStats);

// Route kiểm tra giới hạn sử dụng
router.post('/check-limits', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.checkUsageLimits);

// Routes cơ bản CRUD (đặt sau routes cụ thể)
router.get('/', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.getAll);
router.post('/', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.create);
router.get('/:id', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.getById);
router.put('/:id', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.update);
router.delete('/:id', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), controller.delete);

module.exports = router;