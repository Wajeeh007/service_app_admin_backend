const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const ServicemanService = sequelize.define('ServicemanService', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        serviceman_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        service_item_id: {
            type: DataTypes.UUID,
            allowNull: false,
    
        }
    }, {
        tableName: 'serviceman_services',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    ServicemanService.associate = models => {
        ServicemanService.belongsTo(models.User, {
            foreignKey: 'serviceman_id',
            as: 'serviceman'
        });

        ServicemanService.belongsTo(models.ServiceItem, {
            foreignKey: 'service_item_id',
            as: 'service_item'
        });
    
    }

    return ServicemanService;
}