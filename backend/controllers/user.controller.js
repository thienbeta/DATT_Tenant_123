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
    const { email, password, tenant_name, full_name, phone_number } = req.body;

    // Kiểm tra các trường bắt buộc
    const requiredFields = { email, password, tenant_name, full_name, phone_number };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Các trường sau là bắt buộc: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    // Validate phone number format (VN format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    // Kiểm tra tên tenant đã tồn tại
    const existingTenant = await Tenant.findOne({ where: { name: tenant_name } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Tên tenant đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({
      email,
      password_hash,
      full_name,
      phone_number: phone_number, // Sửa từ phone thành phone_number
      role: 'tenant_admin',
      status: 'active',
      created_at: new Date()
    });

    // Tạo tenant mới
    const newTenant = await Tenant.create({
      name: tenant_name,
      admin_user_id: newUser.user_id,
      status: 'active',
      created_at: new Date()
    });

    // Cập nhật tenant_id cho user
    await newUser.update({ tenant_id: newTenant.tenant_id });

    // Tạo JWT token cho user mới
    const token = jwt.sign(
      { 
        user_id: newUser.user_id,
        email: newUser.email,
        role: newUser.role,
        tenant_id: newTenant.tenant_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Lưu session vào Redis
    const redisClient = require('../config/redisClient');
    const userSessionKey = `user_session:${newUser.user_id}`;
    const sessionData = {
      token,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone_number,
        role: newUser.role,
        tenant_id: newTenant.tenant_id,
        tenant: newTenant
      },
      lastActivity: new Date().toISOString()
    };

    await redisClient.setex(userSessionKey, 24 * 60 * 60, JSON.stringify(sessionData));

    // Trả về thông tin đăng ký thành công
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        full_name: newUser.full_name,
        phone: newUser.phone_number,
        role: newUser.role,
        tenant_id: newTenant.tenant_id,
        tenant: newTenant
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình đăng ký',
      details: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const redisClient = require('../config/redisClient');

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

    // Lưu thông tin đăng nhập vào Redis
    const userSessionKey = `user_session:${user.user_id}`;
    const sessionData = {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant: user.tenant
      },
      lastActivity: new Date().toISOString()
    };

    // Lưu session trong 24 giờ
    await redisClient.setex(userSessionKey, 24 * 60 * 60, JSON.stringify(sessionData));

    // Trả về token và thông tin user
    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant: user.tenant
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone_number } = req.body;
    const user_id = req.user.user_id; // Lấy từ JWT token

    // Validate các trường
    if (!full_name || !phone_number) {
      return res.status(400).json({
        error: 'Họ tên và số điện thoại là bắt buộc'
      });
    }

    // Validate số điện thoại (VN format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    }

    // Cập nhật thông tin user
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    await user.update({
      full_name,
      phone_number
    });

    // Cập nhật session trong Redis
    const redisClient = require('../config/redisClient');
    const userSessionKey = `user_session:${user_id}`;
    const sessionStr = await redisClient.get(userSessionKey);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      session.user.full_name = full_name;
      session.user.phone = phone_number;
      await redisClient.setex(userSessionKey, 24 * 60 * 60, JSON.stringify(session));
    }

    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone_number,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Lỗi khi cập nhật thông tin'
    });
  }
};
