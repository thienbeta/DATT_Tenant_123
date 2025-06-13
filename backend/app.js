const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');
const redisClient = require('./config/redisClient');
const userPurchaseRoutes = require('./routes/user_purchase.routes');
const cors = require('cors');

const app = express();

// Cấu hình CORS chi tiết hơn
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Cho phép các origin cụ thể
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Cho phép các phương thức
  allowedHeaders: ['Content-Type', 'Authorization'], // Cho phép các header
  credentials: true // Cho phép gửi cookie
}));

// Middleware để xử lý JSON
app.use(express.json());

// Kết nối Redis
// (async () => { // Xóa đoạn này
//   try {
//     await redisClient.connect();
//     console.log('✅ Đã kết nối Redis');
//   } catch (error) {
//     console.error('Lỗi kết nối Redis:', error);
//   }
// })();

// Khởi tạo object db để chứa các model
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các model
db.Tenant = require('./models/tenant.model')(sequelize, Sequelize);
db.User = require('./models/user.model')(sequelize, Sequelize);
db.CategoryPackage = require('./models/category_package.model')(sequelize, Sequelize);
db.ServicePackage = require('./models/service_package.model')(sequelize, Sequelize);
db.TenantOfferedPackage = require('./models/tenant_offered_package.model')(sequelize, Sequelize);
db.UserPurchase = require('./models/user_purchase.model')(sequelize, Sequelize);
db.ServiceData = require('./models/service_data.model')(sequelize, Sequelize);
app.use('/api/user-purchases', userPurchaseRoutes);

// Định nghĩa các mối quan hệ
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

// Định nghĩa các route
app.use('/api/tenants', require('./routes/tenant.routes')); // Route mới
app.use('/api/users', require('./routes/user.routes')); // Route mới
app.use('/api/service-packages', require('./routes/service_package.routes')); // Route mới
app.use('/api/tenant-offered-packages', require('./routes/tenant_offered_package.routes')); // Route mới
app.use('/api/user-purchases', require('./routes/user_purchase.routes')); // Route mới
app.use('/api/service-data', require('./routes/service_data.routes')); // Route mới
app.use('/api/categories', require('./routes/category_package.routes')); // Route mới

// Đồng bộ cơ sở dữ liệu và khởi động server
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('Database synced.');
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch(error => {
  console.error('Lỗi đồng bộ cơ sở dữ liệu:', error);
});