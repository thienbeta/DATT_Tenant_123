const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Không tìm thấy token xác thực' });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kiểm tra xem decoded có user_id hoặc userId không
        const userId = decoded.user_id || decoded.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Token không chứa thông tin người dùng' });
        }

        // Tìm user từ database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({ error: 'Người dùng không tồn tại' });
        }

        // Kiểm tra trạng thái user
        if (user.status !== 'active') {
            return res.status(401).json({ error: 'Tài khoản đã bị khóa hoặc không hoạt động' });
        }

        // Kiểm tra tenant_id cho tenant_admin và tenant_user
        if ((user.role === 'tenant_admin' || user.role === 'tenant_user') && !user.tenant_id) {
            return res.status(403).json({ error: 'Người dùng không thuộc tenant nào' });
        }

        // Thêm thông tin user vào request
        req.user = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            tenant_id: user.tenant_id,
            status: user.status
        };

        // Thêm tenant filter cho các truy vấn
        if (user.role !== 'global_admin') {
            req.tenantFilter = { tenant_id: user.tenant_id };
        }
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token đã hết hạn' });
        }
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

module.exports = authMiddleware;