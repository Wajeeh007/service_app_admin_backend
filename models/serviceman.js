const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const serviceman = sequelize.define('serviceman_profiles', {

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
    id_card_front: {
        type: DataTypes.TEXT,
    },
    id_card_back: {
        type: DataTypes.TEXT,
    },
    zone_id: {
        type: DataTypes.INTEGER,
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
    },
    note: {
        type: DataTypes.TEXT,
    },
    availability: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    services: {
        type: DataTypes.JSON
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = serviceman