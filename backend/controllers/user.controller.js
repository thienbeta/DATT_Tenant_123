const { User } = require('../models'); // Bây giờ sẽ có giá trị


// GET /users
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:id
exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    console.log('getCurrentUser called, req.user:', req.user);
    
    if (!req.user) {
      console.log('No req.user found');
      return res.status(401).json({ error: 'Không tìm thấy thông tin người dùng' });
    }

    // Lấy thông tin user mới nhất từ database
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      console.log('User not found in database:', req.user.user_id);
      return res.status(404).json({ error: 'User not found' });
    }

    const response = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
      full_name: user.full_name,
    };

    console.log('Returning user info:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ error: error.message });
  }
};
// POST /users
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /users/:id
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /users/:id
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/tenant/:tenant_id
exports.getByTenant = async (req, res) => {
  try {
    const users = await User.findAll({ where: { tenant_id: req.params.tenant_id } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/role/:role
exports.getByRole = async (req, res) => {
  try {
    const users = await User.findAll({ where: { role: req.params.role } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
