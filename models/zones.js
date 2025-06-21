const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const zone = sequelize.define('zones', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    polylines: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false,
    },
    order_vol: {
        type: DataTypes.ENUM('very_low', 'low', 'medium', 'high', 'very_high'),
        allowNull: false,
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = zone