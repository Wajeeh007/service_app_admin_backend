const {DataTypes} = require('sequelize')
const sequelize = require('../custom_functions/db_connection.js')

module.exports = (sequelize, DataTypes) => {

    const withdrawMethod = sequelize.define('withdraw_methods', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        field_type: {
            type: DataTypes.ENUM('text', 'number', 'email'),
            allowNull: false,
        },
        field_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        placeholder_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    return withdrawMethod;
}