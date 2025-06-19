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
const userPurchaseController = require('../controllers/user_purchase.controller');

router.get('/', userPurchaseController.getAll);
router.get('/:id', userPurchaseController.getById);
router.post('/', userPurchaseController.create);
router.get('/invoice/:purchaseId', userPurchaseController.sendInvoiceEmail);
router.get('/paypal/success', userPurchaseController.paypalSuccess);
router.post('/paypal/success', userPurchaseController.paypalSuccess); // Giữ POST để tương thích
router.post('/paypal/create', userPurchaseController.createPayPalOrder);
router.get('/invoice-pdf/:purchaseId', userPurchaseController.downloadInvoicePDF);
router.get('/paypal/cancel', userPurchaseController.paypalCancel);

module.exports = router;