const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
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
    
        Customer.associate = models => {
            Customer.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

            Customer.hasMany(models.Order, {
            foreignKey: 'customer_id',
            as: 'orders'
        });
        
    }

    return Customer;
}