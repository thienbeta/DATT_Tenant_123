const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenant.controller');

router.get('/', controller.getAll); // Lấy tất cả tenants
router.get('/:id', controller.getById); // Lấy tenant theo ID
router.post('/', controller.create); // Tạo tenant mới
router.put('/:id', controller.update); // Cập nhật tenant
router.delete('/:id', controller.delete); // Xóa tenant

module.exports = router;