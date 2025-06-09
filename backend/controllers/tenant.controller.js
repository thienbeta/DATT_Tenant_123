const { Tenant, User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: [
        { model: User, as: 'adminUser', attributes: ['user_id', 'email'] }
      ]
    });
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [
        { model: User, as: 'adminUser', attributes: ['user_id', 'email'] }
      ]
    });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    await tenant.update(req.body);
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    await tenant.destroy();
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
