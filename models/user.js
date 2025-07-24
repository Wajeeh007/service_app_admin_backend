const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const { v4: uuidv4 } = require('uuid');

const user = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
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
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('active', 'in-active', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  user.associate = function(models) {
    user.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: 'user_id',
      otherKey: 'role_id',
      as: 'roles'
    });
    
    user.hasOne(models.CustomerProfile, {
      foreignKey: 'user_id',
      as: 'customerProfile'
    });
    
    user.hasOne(models.ServicemanProfile, {
      foreignKey: 'user_id',
      as: 'servicemanProfile'
    });
    
    user.hasOne(models.admin, {
      foreignKey: 'user_id',
      as: 'adminProfile'
    });
  };

module.exports = user