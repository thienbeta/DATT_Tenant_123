const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);

    const authHeader = req.headers.authorization;
    
    // Lấy token từ nhiều nguồn
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token from Authorization header:', token);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token from cookie:', token);
    }

    let user = null;

    // Thử xác thực bằng JWT token trước
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'GBJipGLHEg1dCzJ4qbQZUOia+M/ynO++RYZApyY/c0Y=');
        console.log('Decoded token:', decoded);
        
        if (decoded.user_id) {
          user = await User.findByPk(decoded.user_id);
          console.log('User from token:', user ? 'Found' : 'Not found');
        }
      } catch (tokenError) {
        console.log('Token verification failed:', tokenError.message);
      }
    }

    // Nếu không có token hoặc token không hợp lệ, thử session
    if (!user && req.session?.user) {
      console.log('Trying session user:', req.session.user);
      user = await User.findByPk(req.session.user.user_id);
      console.log('User from session:', user ? 'Found' : 'Not found');
    }

    if (!user) {
      console.log('No valid user found');
      return res.status(401).json({ 
        error: 'Không tìm thấy thông tin xác thực',
        debug: {
          hasAuthHeader: !!authHeader,
          hasSession: !!req.session?.user,
          hasCookie: !!req.cookies?.token
        }
      });
    }

    req.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
    };
    
    console.log('Auth successful for user:', req.user.user_id);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Lỗi xác thực: ' + error.message });
  }
};

module.exports = authMiddleware;