const express = require('express');
const router = express.Router();
const { getAll, getById, create, sendInvoiceEmail } = require('../controllers/user_purchase.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/rbac.middleware');

router.use(authMiddleware);

router.get('/', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), getAll);
router.get('/:id', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), getById);
router.post('/', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), create);
router.get('/invoice/:purchaseId', checkRole(['global_admin', 'tenant_admin', 'tenant_user']), sendInvoiceEmail);

module.exports = router;