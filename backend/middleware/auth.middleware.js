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

        // Tìm user từ database
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'Người dùng không tồn tại' });
        }

        // Thêm thông tin user vào request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

module.exports = authMiddleware;