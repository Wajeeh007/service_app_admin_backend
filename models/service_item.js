const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {

    const ServiceItem = sequelize.define('ServiceItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        sub_service_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        sub_service_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        discount: {
            type: DataTypes.INTEGER,
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
        tableName: 'service_item',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
    ServiceItem.associate = models => {
        ServiceItem.belongsTo(models.Service, {
            foreignKey: 'service_id',
            as: 'service'
        });

        ServiceItem.belongsTo(models.SubService, {
            foreignKey: 'sub_service_id',
            as: 'sub_service'
        });

        ServiceItem.belongsToMany(models.Serviceman, {
            foreignKey: 'service_item_id',
            through: 'serviceman_services',
            as: 'serviceman'
        });

        ServiceItem.hasMany(models.Order, {
            foreignKey: 'service_item_id',
            as: 'orders'
        });
    }
    return ServiceItem;
}