const express = require('express');
const router = express.Router();
const CategoryPackageController = require('../controllers/category_package.controller');

// Define routes for category packages
router.post('/', CategoryPackageController.createCategory);
router.get('/', CategoryPackageController.getAllCategories);
router.get('/:id', CategoryPackageController.getCategoryById);
router.put('/:id', CategoryPackageController.updateCategory);
router.delete('/:id', CategoryPackageController.deleteCategory);

module.exports = router;