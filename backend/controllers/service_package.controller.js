const { ServicePackage } = require('../models');
const { Sequelize } = require('sequelize');
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware for create and update
const validateServicePackage = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must not exceed 255 characters'),
  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('package_type')
    .notEmpty()
    .withMessage('Package type is required')
    .isIn(['free', 'pro', 'vip_pro', 'enterprise'])
    .withMessage('Package type must be one of: free, pro, vip_pro, enterprise'),
  body('service_type')
    .notEmpty()
    .withMessage('Service type is required')
    .isIn(['crm', 'storage', 'communication', 'database'])
    .withMessage('Service type must be one of: crm, storage, communication, database'),
  body('file_storage_limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('File storage limit must be a non-negative integer'),
  body('bandwidth_limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bandwidth limit must be a non-negative integer'),
  body('database_limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Database limit must be a non-negative integer'),
  body('api_call_limit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('API call limit must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'deleted'])
    .withMessage('Status must be one of: active, inactive, deleted'),
];

// Validation middleware for ID parameter
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
];

// Validation middleware for query parameters
const validateQueryParams = [
  query('package_type')
    .optional()
    .isIn(['free', 'pro', 'vip_pro', 'enterprise'])
    .withMessage('Package type must be one of: free, pro, vip_pro, enterprise'),
  query('service_type')
    .optional()
    .isIn(['crm', 'storage', 'communication', 'database'])
    .withMessage('Service type must be one of: crm, storage, communication, database'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'deleted'])
    .withMessage('Status must be one of: active, inactive, deleted'),
];

// Middleware to handle validation errors
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

// Create a new service package
exports.createServicePackage = [
  validateServicePackage,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        package_type,
        service_type,
        file_storage_limit,
        bandwidth_limit,
        database_limit,
        api_call_limit,
        status,
      } = req.body;

      // 🔍 Check for duplicate limits
      const existingPackage = await ServicePackage.findOne({
        where: {
          file_storage_limit,
          bandwidth_limit,
          database_limit,
          api_call_limit,
        },
      });

      if (existingPackage) {
        return res.status(400).json({
          message: 'A service package with the same resource limits already exists.',
        });
      }

      const servicePackage = await ServicePackage.create({
        name,
        description,
        price,
        package_type,
        service_type,
        file_storage_limit,
        bandwidth_limit,
        database_limit,
        api_call_limit,
        status,
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

// Get all service packages with optional filtering
exports.getAllServicePackages = [
  validateQueryParams,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { package_type, service_type, status } = req.query;
      const where = {};

      if (package_type) where.package_type = package_type;
      if (service_type) where.service_type = service_type;
      if (status) where.status = status;

      const servicePackages = await ServicePackage.findAll({
        where,
        attributes: {
          exclude: ['created_at'], // Exclude created_at if not needed
        },
        order: [['created_at', 'DESC']], // Order by created_at descending
        
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

// Get a single service package by ID
exports.getServicePackageById = [
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const servicePackage = await ServicePackage.findByPk(id, {
        attributes: {
          exclude: ['created_at'], // Exclude created_at if not needed
        },
      });

      if (!servicePackage) {
        return res.status(404).json({
          message: 'Service package not found',
        });
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

// Update a service package
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
        package_type,
        service_type,
        file_storage_limit,
        bandwidth_limit,
        database_limit,
        api_call_limit,
        status,
      } = req.body;

      const servicePackage = await ServicePackage.findByPk(id);

      if (!servicePackage) {
        return res.status(404).json({
          message: 'Service package not found',
        });
      }

      await servicePackage.update({
        name,
        description,
        price,
        package_type,
        service_type,
        file_storage_limit,
        bandwidth_limit,
        database_limit,
        api_call_limit,
        status,
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

// Delete a service package (soft delete by setting status to 'deleted')
exports.deleteServicePackage = [
  validateId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      const servicePackage = await ServicePackage.findByPk(id);

      if (!servicePackage) {
        return res.status(404).json({
          message: 'Service package not found',
        });
      }

      await servicePackage.update({ status: 'deleted' });

      return res.status(200).json({
        message: 'Service package deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting service package',
        error: error.message,
      });
    }
  },
];