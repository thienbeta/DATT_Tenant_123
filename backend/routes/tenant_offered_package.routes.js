const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenant_offered_package.controller');

router.get('/', controller.getAll);
router.get('/:tenantId/:packageId', controller.getById); // Lưu ý: Composite key
router.post('/', controller.create);
router.put('/:tenantId/:packageId', controller.update);
router.delete('/:tenantId/:packageId', controller.delete);

module.exports = router;