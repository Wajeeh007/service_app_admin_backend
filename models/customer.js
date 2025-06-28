const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const customer = sequelize.define('customer', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    account_suspended: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
    rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = customer