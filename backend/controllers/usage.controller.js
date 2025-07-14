const { ServiceData, ServicePackage } = require('../models');

exports.addBandwidthUsage = async (req, res) => {
  const { tenant_id, user_id, package_id, bandwidth_used } = req.body;
  if (!tenant_id || !user_id || !package_id || !bandwidth_used) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const serviceData = await ServiceData.findOne({ where: { tenant_id, user_id, package_id, status: 'active' } });
  if (serviceData) {
    await serviceData.update({
      bandwidth_used: (serviceData.bandwidth_used || 0) + bandwidth_used
    });
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Service data not found' });
}; 