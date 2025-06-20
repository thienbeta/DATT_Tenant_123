const express = require('express');
const router = express.Router();
const servicePackageController = require('../controllers/service_package.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/rbac.middleware');

router.use(authMiddleware);

router.post('/', checkRole(['global_admin']), servicePackageController.createServicePackage);
router.get('/', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), servicePackageController.getAllServicePackages);
router.get('/:id', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), servicePackageController.getServicePackageById);
router.put('/:id', checkRole(['global_admin']), servicePackageController.updateServicePackage);
router.delete('/:id', checkRole(['global_admin']), servicePackageController.deleteServicePackage);

module.exports = router;