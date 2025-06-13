const express = require('express');
const router = express.Router();
const { getAll, getById, create, sendInvoiceEmail } = require('../controllers/user_purchase.controller');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.get('/invoice/:purchaseId', sendInvoiceEmail);

module.exports = router;