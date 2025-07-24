const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const customer = sequelize.define('customer_profiles', {

    user_id: {
        type: DataTypes.STRING,
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
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = customer