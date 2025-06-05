const { ServicePackage } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const packages = await ServicePackage.findAll();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const package = await ServicePackage.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Service package not found' });
    }
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const package = await ServicePackage.create(req.body);
    res.status(201).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const package = await ServicePackage.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Service package not found' });
    }
    await package.update(req.body);
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const package = await ServicePackage.findByPk(req.params.id);
    if (!package) {
      return res.status(404).json({ error: 'Service package not found' });
    }
    await package.destroy();
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};