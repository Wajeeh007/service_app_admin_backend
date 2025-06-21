const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

const subService = sequelize.define('sub_service', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    service_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_associated_items: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = subService