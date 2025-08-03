const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        serviceman_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },  
        customer_remarks: {
            type: DataTypes.TEXT,
        },
        serviceman_remarks: {
            type: DataTypes.TEXT,
        },
        rating_by_customer: {
            type: DataTypes.DECIMAL,
        },
        rating_by_serviceman: {
            type: DataTypes.DECIMAL,
        },
        serviceman_review_date: {
            type: DataTypes.DATE
        },
        customer_review_date: {
            type: DataTypes.DATE
        },
    }, {
        tableName: 'reviews',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
    Review.associate = models => {
        Review.belongsTo(models.User, {
            foreignKey: 'customer_id',
            as: 'customer_review'
        });

        Review.belongsTo(models.User, {
            foreignKey: 'serviceman_id',
            as: 'serviceman_review'
        })

        Review.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order'
        })
    }
    return Review 
}