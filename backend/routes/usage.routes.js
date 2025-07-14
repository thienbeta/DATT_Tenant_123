const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usage.controller');

router.post('/bandwidth', usageController.addBandwidthUsage);

module.exports = router; 