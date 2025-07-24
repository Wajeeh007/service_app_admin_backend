const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      assigned_by: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      }
    }, {
      tableName: 'user_roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'role_id']
        }
      ]
  });

  UserRole.associate = models => {
    UserRole.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    UserRole.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });

    UserRole.belongsTo(models.User, {
      foreignKey: 'assigned_by',
      as: 'assigned_by_user'
    });
  };

  return UserRole;
}