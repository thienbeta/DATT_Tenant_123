  module.exports = (sequelize, DataTypes) => {
    const ServicePackage = sequelize.define('ServicePackage', {
      package_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      billing_cycle: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'one-time', 'indefinite'),
        allowNull: false,
        defaultValue: 'indefinite',
      },
      package_type: {
        type: DataTypes.ENUM('free', 'pro', 'vip_pro', 'enterprise'),
        allowNull: false,
        defaultValue: 'free',
      },
      service_type: {
        type: DataTypes.ENUM('crm', 'storage', 'communication', 'database'),
        allowNull: false,
      },
      file_storage_limit: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0, // 0 = unlimited
      },
      bandwidth_limit: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      database_limit: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      api_call_limit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active',
      },
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        
      },
    }, {
      tableName: 'service_packages',
      timestamps: false,
    });

    ServicePackage.associate = (models) => {
      ServicePackage.belongsToMany(models.Tenant, {
        through: models.TenantOfferedPackage,
        foreignKey: 'package_id',
        as: 'tenants',
      });
      ServicePackage.hasMany(models.UserPurchase, {
        foreignKey: 'package_id',
        as: 'purchases',
      });
      ServicePackage.hasMany(models.ServiceData, {
        foreignKey: 'package_id',
        as: 'serviceData',
      });
      ServicePackage.belongsTo(models.CategoryPackage, {
        foreignKey: 'category_id',
        as: 'category',
      });
    };

    return ServicePackage;
  };
