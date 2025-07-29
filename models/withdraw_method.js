const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {

    const WithdrawMethod = sequelize.define('WithdrawMethod', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
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
        tableName: 'withdraw_methods',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    return WithdrawMethod;
}