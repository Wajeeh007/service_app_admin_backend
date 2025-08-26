const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const AdminProfile = sequelize.define('AdminProfile', {
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
      // permissions: {
      //   type: DataTypes.JSON
      // },
      last_login: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      tableName: 'admin_profiles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

    AdminProfile.associate = models => {
      AdminProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      AdminProfile.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'roles',
      });
    };
  return AdminProfile;
}