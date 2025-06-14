const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Thêm route đăng nhập
router.post('/login', controller.login);

// Thêm route đăng ký
router.post('/register', controller.register);

router.get('/me', authMiddleware, controller.getCurrentUser)

router.get('/', controller.getAll);                  // GET all users
router.get('/:id', controller.getById);              // GET user by ID
router.post('/', controller.create);                 // POST new user
router.put('/:id', controller.update);               // PUT update user
router.put('/profile', authMiddleware, controller.updateProfile);
router.delete('/:id', controller.delete);            // DELETE user
router.get('/tenant/:tenant_id', controller.getByTenant); // GET users by tenant_id
router.get('/role/:role', controller.getByRole);     // GET users by role


module.exports = router;
