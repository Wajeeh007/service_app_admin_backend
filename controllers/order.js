const errors = require('../errors/index.js')
const order = require('../models/order.js')
const customer = require('../models/customer.js')
const serviceman = require('../models/serviceman.js')
const serviceItem = require('../models/service_item.js')
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

const getOrders = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    let orderStatus
    
    if(req.query.status) {
        const validStatuses = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled', 'disputed'];

        if(validStatuses.includes(req.query.status)) {
            orderStatus = req.query.status
        } else {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {
        
        const result = await order.findAll({
            where: orderStatus !== undefined && orderStatus !== null ? {status: orderStatus} : {},
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            order: [['created_at', 'ASC']],
            attributes: {exclude: ['updated_at']}
        })

        if(orderStatus !== undefined && orderStatus !== null) {

            for (let i = 0; i < result.length; i++) {
                const singleOrder = result[i].toJSON();

                const customerInfo = await customer.findByPk(result[i].customer_id, {
                attributes: ['name'],
                });

                const servicemanInfo = await serviceman.findByPk(result[i].service_man_id, {
                attributes: ['name'],
                });

                singleOrder.customer = customerInfo;
                singleOrder.serviceman = servicemanInfo;

                result[i] = singleOrder;
            }
        }
        
        console.log('Returning Values')
        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched orders',
            limit: paginationData.limit,
            page: paginationData.page,
            data: result
        })
    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getOrdersStats = async (req, res, next) => {
    try {
        const pending = await order.count({
        where: {status: 'pending'}
        })

        const accepted = await order.count({
            where: {status: 'accepted'}
        })

        const ongoing = await order.count({
            where: {status: 'ongoing'}
        })

        const completed = await order.count({
            where: {status: 'completed'}
        })

        const cancelled = await order.count({
            where: {status: 'cancelled'}
        })

        const disputed = await order.count({
            where: {status: 'disputed'}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched orders stats',
            data: {pending, accepted, ongoing, completed, cancelled, disputed}
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

module.exports = {
    getOrders,
    getOrdersStats,

}