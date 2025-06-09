const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

// Thêm route đăng ký
router.post('/register', controller.register);

router.get('/', controller.getAll);                  // GET all users
router.get('/:id', controller.getById);              // GET user by ID
router.post('/', controller.create);                 // POST new user
router.put('/:id', controller.update);               // PUT update user
router.delete('/:id', controller.delete);            // DELETE user
router.get('/tenant/:tenant_id', controller.getByTenant); // GET users by tenant_id
router.get('/role/:role', controller.getByRole);     // GET users by role

module.exports = router;
