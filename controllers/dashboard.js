const {User, Order, Zone, sequelize} = require('../models')
const { Op } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const errors = require('../errors/index.js')
const {ZoneWiseTimePeriodSelection} = require('../utils/statuses.js')

const getUserStats = async (req, res, next) => {

    try {
        const totalActiveCustomers = await User.count({
            where: {status: 'active'},
            include: [{
                association: 'customer_profile',
                attributes: [],
                required: true
            }],
            attributes: []
        })

        const totalActiveServicemen = await User.count({
            where: {status: 'active'},
            include: [{
                association: 'serviceman_profile',
                attributes: [],
                required: true
            }],
            attributes: []
        })

        const totalOrders = await Order.count()

        const totalEarning = await Order.sum('commission_amount', {
            where: {[Op.and]: [{status: 'completed'}, {'payment_status': 1}]}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched user stats',
            data: {
                total_active_customers: totalActiveCustomers,
                total_active_servicemen: totalActiveServicemen,
                total_orders: totalOrders,
                total_earning: (totalEarning === null || totalEarning === undefined) ? 0 : totalEarning
            }
        })
    } catch (e) {
        return next(new errors.InternalServerError())
    }

}

const getZoneWiseTimePeriodStats = async (req, res, next) => {

    const timePeriod = req.query.time_period

    if(timePeriod === undefined || timePeriod === null || ZoneWiseTimePeriodSelection.includes(timePeriod) === false) {
        return next(new errors.BadRequestError('Invalid time period provided'))
    }

    let upperLimit = new Date()
    let lowerLimit = new Date()

    if(timePeriod === 'Today') {
        const now = new Date()
        upperLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        lowerLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if(timePeriod === 'Yesterday') {
        const now = new Date()
        upperLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        lowerLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    } else if(timePeriod === 'This Week') {
        const currentDate = new Date();
        const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const weekStartDay = 'Monday';

        let daysToSubtract;
        
        if (weekStartDay.toLowerCase() === 'monday') {
            daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
        } else {
            daysToSubtract = currentDay;
        }
        
        lowerLimit = new Date(currentDate);
        lowerLimit.setDate(currentDate.getDate() - daysToSubtract);
        lowerLimit.setHours(0, 0, 0, 0);
        upperLimit = new Date(currentDate);
        upperLimit.setDate(currentDate.getYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
    
    } else {
        const now = new Date()
        upperLimit = now;
        lowerLimit = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    try {
        const topZones = await Zone.findAll({
            attributes: ['id', 'name', [sequelize.fn('COUNT', sequelize.col('orders.id')),'order_count']],
            include: [{
                model: Order,
                as: 'orders',
                attributes: [],
                where: {
                    created_at: {[Op.between]: [lowerLimit, upperLimit]}
                },
                required: false
                }],
            group: ['Zone.id'], // Group by zone to get counts per zone
            order: [[sequelize.fn('COUNT', sequelize.col('orders.id')), 'DESC']],
            limit: 3,
            subQuery: false
        });

        const totalOrders = await Order.count({
            where: {
                created_at: {[Op.between]: [lowerLimit, upperLimit]}
            }
        })

        const result = topZones.map(zone => ({
            ...zone.toJSON(),
            order_rate: (parseInt(zone.dataValues.order_count) / parseInt(totalOrders) * 100) || 0
        }));

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched zone wise time period stats',
            data: result
        })

    } catch(e) {
        return next(new errors.InternalServerError())
    }

}

module.exports = {
    getUserStats,
    getZoneWiseTimePeriodStats

}