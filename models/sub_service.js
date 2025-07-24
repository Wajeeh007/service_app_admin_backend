const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const SubService = sequelize.define('SubService', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4(),
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        service_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_associated_items: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'sub_service',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    SubService.associate = models => {
        SubService.belongsTo(models.Service, {
            foreignKey: 'service_id',
            as: 'service'
        })

        SubService.hasMany(models.ServiceItem, {
            foreignKey: 'sub_service_id',
            as: 'service_item'
        })
    }
    return SubService;
}