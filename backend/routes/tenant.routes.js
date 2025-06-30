const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenant.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, controller.getAll);
router.get('/:id', authMiddleware, controller.getById);
router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;
