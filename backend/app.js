const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database'); // Giả định file cấu hình Sequelize

const app = express();

// Middleware để xử lý JSON
app.use(express.json());

// Khởi tạo object db để chứa các model
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import các model
db.Tenant = require('./models/tenant.model')(sequelize, Sequelize);
db.User = require('./models/user.model')(sequelize, Sequelize);
db.ServicePackage = require('./models/service_package.model')(sequelize, Sequelize);
db.TenantOfferedPackage = require('./models/tenant_offered_package.model')(sequelize, Sequelize);
db.UserPurchase = require('./models/user_purchase.model')(sequelize, Sequelize);
db.ServiceData = require('./models/service_data.model')(sequelize, Sequelize);

// Định nghĩa các mối quan hệ
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

// Định nghĩa các route
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/brands', require('./routes/brand.routes'));
app.use('/api/tenants', require('./routes/tenant.routes')); // Route mới
app.use('/api/users', require('./routes/user.routes')); // Route mới
app.use('/api/service-packages', require('./routes/service_package.routes')); // Route mới
app.use('/api/tenant-offered-packages', require('./routes/tenant_offered_package.routes')); // Route mới
app.use('/api/user-purchases', require('./routes/user_purchase.routes')); // Route mới
app.use('/api/service-data', require('./routes/service_data.routes')); // Route mới

// Đồng bộ cơ sở dữ liệu và khởi động server
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced.');
  app.listen(3000, () => console.log('Server running on port 3000'));
});