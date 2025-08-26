const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  });

    Role.associate = models => {
      Role.belongsToMany(models.User, {
        through: 'user_roles',
        foreignKey: 'role_id',
        otherKey: 'user_id',
        as: 'users'
      });

      Role.hasMany(models.AdminProfile, {
        foreignKey: 'role_id',
        as: 'admin_profile'
       });
    };
  return Role;
}
