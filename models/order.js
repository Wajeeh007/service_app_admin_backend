const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4(),
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        serviceman_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        customer_address_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        service_item_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        zone_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'disputed'),
            allowNull: false,
        
        },
        date_and_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
        },
        commission_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'orders',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    Order.associate = models => {
        Order.belongsTo(models.User, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
        Order.belongsTo(models.User, {
            foreignKey: 'serviceman_id',
            as: 'serviceman'
        });

        // Order.belongsTo(models.Address, {
        //     foreignKey: 'customer_address_id',
        //     as: 'customer_address'
        // });

        Order.belongsTo(models.ServiceItem, {
            foreignKey: 'service_item_id',
            as: 'service_item'
        });

        Order.belongsTo(models.Zone, {
            foreignKey: 'zone_id',
            as: 'zone'
        });

        Order.hasOne(models.Review, {
            foreignKey: 'order_id',
            as: 'review'
        })
    }
    return Order;
}