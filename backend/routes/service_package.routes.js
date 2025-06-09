const express = require('express');
const router = express.Router();
const servicePackageController = require('../controllers/service_package.controller');

router.post('/', servicePackageController.createServicePackage);
router.get('/', servicePackageController.getAllServicePackages);
router.get('/:id', servicePackageController.getServicePackageById);
router.put('/:id', servicePackageController.updateServicePackage);
router.delete('/:id', servicePackageController.deleteServicePackage);

module.exports = router;