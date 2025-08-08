const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100)
    },
    profile_image: {
      type: DataTypes.STRING
    },
    email_verified_at: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('pending','active', 'inactive', 'declined', 'suspended'),
      defaultValue: 'pending',
      allowNull: false,
    },
    suspension_note: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      defaultValue: 'male',
      allowNull: false,
    },
    rating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.00,
      allowNull: false,
    },

  }, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = models => {
    User.belongsToMany(models.Role, {
      through: 'user_roles',
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles'
    });

    User.hasOne(models.Customer, {
      foreignKey: 'user_id',
      as: 'customer_profile'
    });

    User.hasOne(models.Serviceman, {
      foreignKey: 'user_id',
      as: 'serviceman_profile'
    });

    User.hasOne(models.AdminProfile, {
      foreignKey: 'user_id',
      as: 'admin_profile'
    });

    User.hasMany(models.Order, {
      foreignKey: 'customer_id',
      as: 'customer'
    });

    User.hasMany(models.Review, {
      foreignKey: 'customer_id',
      as: 'customer_review'
    });

    User.hasMany(models.WithdrawRequests, {
      foreignKey: 'serviceman_id',
      as: 'withdraw_requests'
    });

    // User.hasMany(models.Address, {
    //   foreignKey: 'user_id',
    //   as: 'addresses'
    // });

    User.hasMany(models.Order, {
      foreignKey: 'serviceman_id',
      as: 'serviceman'
    })

    User.hasMany(models.Review, {
      foreignKey: 'serviceman_id',
      as: 'serviceman_review'
    });

    User.hasMany(models.ServicemanService, {
      foreignKey: 'serviceman_id',
      as: 'serviceman_service'
    });
  }

  return User;
}
