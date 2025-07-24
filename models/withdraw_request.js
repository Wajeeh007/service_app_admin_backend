const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')
module.exports = (sequelize, DataTypes) => {
    const withdrawRequest = sequelize.define('withdraw_requests', {
        serviceman_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        serviceman_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        withdraw_method_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        withdraw_method_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_id: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'settled', 'denied'),
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
        },
        receipt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transfer_date: {
            type: DataTypes.DATE,
        }
    }, {
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    return withdrawRequest;
}