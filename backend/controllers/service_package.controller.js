const { ServicePackage, CategoryPackage } = require('../models');
const { body, param, query, validationResult } = require('express-validator');

// ========================= VALIDATORS =========================
const validateServicePackage = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 255 }).withMessage('Name must not exceed 255 characters'),

  body('description')
    .optional()
    .trim()
    .isString().withMessage('Description must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('billing_cycle')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly', 'one-time', 'indefinite'])
    .withMessage('Billing cycle must be one of: monthly, quarterly, yearly, one-time, indefinite'),

  body('package_type')
    .notEmpty().withMessage('Package type is required')
    .isIn(['free', 'pro', 'vip_pro', 'enterprise'])
    .withMessage('Package type must be one of: free, pro, vip_pro, enterprise'),

  body('file_storage_limit')
    .optional()
    .isInt({ min: 0 }).withMessage('File storage limit must be a non-negative integer'),

  body('start_date')
    .optional({ nullable: true })
    .isDate().withMessage('Start date must be a valid date'),

  body('end_date')
    .optional({ nullable: true })
    .isDate().withMessage('End date must be a valid date'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'deleted'])
    .withMessage('Status must be one of: active, inactive, deleted'),

  body('category_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer')
];

const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

const validateQueryParams = [
  query('package_type')
    .optional()
    .isIn(['free', 'pro', 'vip_pro', 'enterprise'])
    .withMessage('Package type must be one of: free, pro, vip_pro, enterprise'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'deleted'])
    .withMessage('Status must be one of: active, inactive, deleted'),

  query('category_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

// ========================= CONTROLLERS =========================
exports.createServicePackage = [
  validateServicePackage,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        billing_cycle,
        package_type,
        file_storage_limit,
        start_date,
        end_date,
        status,
        category_id,
        created_at = new Date(),
      } = req.body;

      if (category_id) {
        const category = await CategoryPackage.findByPk(category_id);
        if (!category) {
          return res.status(400).json({ message: 'Invalid category ID' });
        }
      }

      const existingPackage = await ServicePackage.findOne({
        where: { name, package_type, category_id },
      });

      if (existingPackage) {
        return res.status(400).json({
          message: 'A service package with the same name, type and category already exists.',
        });
      }

      const servicePackage = await ServicePackage.create({
        name,
        description,
        price,
        billing_cycle,
        package_type,
        file_storage_limit,
        start_date,
        end_date,
        status,
        category_id,
        created_at: new Date(created_at),
      });

      return res.status(201).json({
        message: 'Service package created successfully',
        data: servicePackage,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating service package',
        error: error.message,
      });
    }
  },
];

exports.getAllServicePackages = [
  validateQueryParams,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { package_type, status, category_id } = req.query;
      const where = {};

      if (package_type) where.package_type = package_type;
      if (status) where.status = status;
      if (category_id) where.category_id = category_id;

      const servicePackages = await ServicePackage.findAll({
        where,
        include: [{ model: CategoryPackage, as: 'category' }],
        order: [['created_at', 'DESC']],
      });

      return res.status(200).json({
        message: 'Service packages retrieved successfully',
        data: servicePackages,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error retrieving service packages',
        error: error.message,
      });
    }
  },
];

exports.getServicePackageById = [
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const servicePackage = await ServicePackage.findByPk(id, {
        include: [{ model: CategoryPackage, as: 'category' }],
      });

      if (!servicePackage) {
        return res.status(404).json({ message: 'Service package not found' });
      }

      return res.status(200).json({
        message: 'Service package retrieved successfully',
        data: servicePackage,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error retrieving service package',
        error: error.message,
      });
    }
  },
];

exports.updateServicePackage = [
  validateId,
  validateServicePackage,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        billing_cycle,
        package_type,
        file_storage_limit,
        start_date,
        end_date,
        status,
        category_id,
      } = req.body;

      const servicePackage = await ServicePackage.findByPk(id);

      if (!servicePackage) {
        return res.status(404).json({ message: 'Service package not found' });
      }

      if (category_id) {
        const category = await CategoryPackage.findByPk(category_id);
        if (!category) {
          return res.status(400).json({ message: 'Invalid category ID' });
        }
      }

      await servicePackage.update({
        name,
        description,
        price,
        billing_cycle,
        package_type,
        file_storage_limit,
        start_date,
        end_date,
        status,
        category_id,
      });

      return res.status(200).json({
        message: 'Service package updated successfully',
        data: servicePackage,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error updating service package',
        error: error.message,
      });
    }
  },
];

exports.deleteServicePackage = [
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const servicePackage = await ServicePackage.findByPk(id);
      if (!servicePackage) {
        return res.status(404).json({ message: 'Service package not found' });
      }

      await servicePackage.update({ status: 'deleted' });

      return res.status(200).json({ message: 'Service package deleted successfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting service package',
        error: error.message,
      });
    }
  },
];
