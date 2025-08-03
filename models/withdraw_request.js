const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const WithdrawRequests = sequelize.define('WithdrawRequests', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
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
            defaultValue: 'pending',
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
        tableName: 'withdraw_requests',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    WithdrawRequests.associate = models => {
        WithdrawRequests.belongsTo(models.User, {
            foreignKey: 'serviceman_id',
            as: 'withdraw_requests'
        })
    }
    return WithdrawRequests;
}