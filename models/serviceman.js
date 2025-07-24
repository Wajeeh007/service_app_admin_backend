const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const ServicemanProfile = sequelize.define('ServicemanProfile', {
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
        services: {
            type: DataTypes.JSON
        }
    }, {
        tableName: 'serviceman_profiles',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    ServicemanProfile.associate = models => {

        ServicemanProfile.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    }
    return ServicemanProfile
}