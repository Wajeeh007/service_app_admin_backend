const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Zone = sequelize.define('Zone', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
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
            defaultValue: 'very_low'
        }
    }, {
        tableName: 'zones',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    Zone.associate = models => {
        Zone.hasMany(models.Order, {
            foreignKey: 'zone_id',
            as: 'orders'
        });
        
        Zone.hasMany(models.Serviceman, {
            foreignKey: 'zone_id',
            as: 'serviceman'
        });
    }

    return Zone
}