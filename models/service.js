const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        total_associated_services: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'service',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    Service.associate = models => {
    
        Service.hasMany(models.SubService, {
            foreignKey: 'service_id',
            as: 'sub_services'
        });
        Service.hasMany(models.ServiceItem, {
            foreignKey: 'service_id',
            as: 'service_items'
        });
    }
    return Service;
}