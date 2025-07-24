const { v4: uuidv4 } = require('uuid');

const role = sequelize.define('roles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

  role.associate = function(models) {
    role.belongsToMany(models.user, {
      through: models.UserRole,
      foreignKey: 'role_id',
      otherKey: 'user_id',
      as: 'users'
    });
  };

module.exports = role