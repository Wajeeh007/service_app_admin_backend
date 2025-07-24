const { v4: uuidv4 } = require('uuid');

const admin = sequelize.define('admin_profile', {
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
    permissions: {
      type: DataTypes.JSON
    },
    last_login: {
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  admin.associate = function(models) {
    admin.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };