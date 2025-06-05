const { ServiceData } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await ServiceData.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ServiceData.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Service data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await ServiceData.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await ServiceData.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Service data not found' });
    }
    await data.update(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await ServiceData.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Service data not found' });
    }
    await data.destroy();
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};