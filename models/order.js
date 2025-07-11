const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const order = sequelize.define('orders', {

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_man_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    customer_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    zone_id: {
        type: DataTypes.INTEGER,
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
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = order