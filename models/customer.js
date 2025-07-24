const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const CustomerProfile = sequelize.define('CustomerProfile', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4(),
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        total_orders: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        total_spent: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.00
        },
        preferences: {
            type: DataTypes.JSON,
        }
        }, {
            tableName: 'customer_profiles',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        });
    
        CustomerProfile.associate = models => {
            CustomerProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    }

    return CustomerProfile;
}