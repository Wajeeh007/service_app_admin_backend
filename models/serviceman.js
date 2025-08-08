const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Serviceman = sequelize.define('Serviceman', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4(),
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
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
        id_card_front: {
            type: DataTypes.TEXT,
        },
        id_card_back: {
            type: DataTypes.TEXT,
        },
        zone_id: {
            type: DataTypes.UUID,
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
    }, {
        tableName: 'serviceman_profiles',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Serviceman.associate = models => {

        Serviceman.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });

        Serviceman.hasMany(models.WithdrawRequests, {
            foreignKey: 'serviceman_id',
            as: 'withdraw_requests'
        })

        Serviceman.hasMany(models.Order, {
            foreignKey: 'serviceman_id',
            as: 'orders'
        });

        Serviceman.belongsTo(models.Zone, {
            foreignKey: 'zone_id',
            as: 'zone'
        });
    }
    return Serviceman
}