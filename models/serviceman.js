const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const serviceman = sequelize.define('service_man', {

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
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    rating: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    },
    id_card_front: {
        type: DataTypes.STRING,
    },
    id_card_back: {
        type: DataTypes.STRING,
    },
    zone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_orders: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    earnings: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    identification_number: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    identification_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = serviceman