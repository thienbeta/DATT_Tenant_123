const { User, Tenant } = require('../models'); // Need to import Tenant model
const bcrypt = require('bcrypt'); // Missing bcrypt import
const jwt = require('jsonwebtoken');

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

exports.register = async (req, res) => {
  try {
    const { email, password, tenant_name } = req.body;

    if (!email || !password || !tenant_name) {
      return res.status(400).json({ error: 'Email, mật khẩu và tên tenant là bắt buộc' });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Tạo user trước
    const newUser = await User.create({
      email,
      password_hash,
      role: 'tenant_admin',
      status: 'active'
    });

    // Tạo tenant mới
    const newTenant = await Tenant.create({
      name: tenant_name,
      admin_user_id: newUser.user_id,
      status: 'active'
    });

    // Cập nhật tenant_id cho user
    await newUser.update({ tenant_id: newTenant.tenant_id });

    // Trả về thông tin user (không bao gồm password)
    const { password_hash: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }

    // Tìm user theo email
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Tenant, as: 'tenant' }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant: user.tenant
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
