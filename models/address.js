const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: () => uuidv4(),
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        zone_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        label: {
            type: DataTypes.ENUM('home', 'work', 'other'),
            allowNull: false,
        },
        house_apartment_no: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        street_floor_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lane: {
            type: DataTypes.STRING,
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        building_name: {
            type: DataTypes.STRING,
        },
        nearby_landmark: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.TEXT,
        },
    }, {
        tableName: 'customer_address',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    Address.associate = (models) => {
        Address.belongsTo(models.User, {
            foreignKey: 'customer_id',
            as: 'customer'
        });

        Address.hasMany(models.Order, {
            foreignKey: 'customer_address_id',
            as: 'customer_address'
        });

        Address.belongsTo(models.Zone, {
            foreignKey: 'zone_id',
            as: 'zone'
        });

    }

    return Address
}