const errors = require('../errors/index.js')
const {Order, User} = require('../models')
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const { Op } = require("sequelize");

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
        
        const result = await Order.findAll({
            where: orderStatus !== undefined && orderStatus !== null ? {status: orderStatus} : {},
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            order: [['created_at', 'ASC']],
            attributes: {exclude: ['updated_at']}
        })

        if(orderStatus !== undefined && orderStatus !== null) {

            for (let i = 0; i < result.length - 1; i++) {
                const singleOrder = result[i].toJSON();

                const customerInfo = await User.findByPk(result[i].customer_id, {
                    attributes: ['name'],
                });

                const servicemanInfo = await User.findByPk(result[i].serviceman_id, {
                    attributes: ['name'],
                });

                singleOrder.customer = customerInfo;
                singleOrder.serviceman = servicemanInfo;

                result[i] = singleOrder;
            }
        }
        
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
        const pending = await Order.count({
        where: {status: 'pending'}
        })

        const accepted = await Order.count({
            where: {status: 'accepted'}
        })

        const ongoing = await Order.count({
            where: {status: 'ongoing'}
        })

        const completed = await Order.count({
            where: {status: 'completed'}
        })

        const cancelled = await Order.count({
            where: {status: 'cancelled'}
        })

        const disputed = await Order.count({
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

const getSingleUserOrders = async (req, res, next) => {
    const userId = req.params.id

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        let userOrders = []
        
        userOrders = await Order.findAll({
            where: {[Op.or]: [{ customer_id: userId }, { serviceman_id: userId }]},
            include: [{
                association: 'customer',
                attributes: [['name', 'customer_name']],
                required: true,
            },
            {
                association: 'serviceman',
                attributes: [['name', 'serviceman_name']],
                required: true,
            }],
            order: [['created_at', 'ASC']],
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            attributes: {exclude: ['updated_at']}
        })

        if(userOrders.length > 0) {
            userOrders = userOrders.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.customer_profile,
                    customer_profile: undefined,
                    ...uJson,
                    ...uJson.serviceman_profile,
                    serviceman_profile: undefined
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched User Orders',
            data: userOrders,
            limit: paginationData.limit,
            page: paginationData.page
        })

    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

module.exports = {
    getOrders,
    getOrdersStats,
    getSingleUserOrders

}