const errors = require('../errors/index.js')
const {Role, Serviceman, User, ServicemanService, Order, Review, ServiceItem} = require('../models')
const { Op, fn, col } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const setBodyValues = require('../custom_functions/set_body_values.js')
const {UserStatuses} = require('../utils/statuses.js')

const getServicemen = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    const status = req.query.status

    if(status !== undefined && status !== null) {
        if(!UserStatuses.includes(status)) {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {

        let result = {}

        if(status !== undefined && status !== null) {
            result = await User.findAll({
                where: {status: status},
                include: [{
                    association: 'serviceman_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id', 'services', 'zone_id', 'longitude', 'latitude', 'services', 'availability', 'note']},
                    required: true,
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at', 'password_hash', 'profile_image', 'email_verified_at']}
            })
        } else {
            result = await User.findAll({
                include: [{
                    association: 'serviceman_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id', 'zone_id','latitude','longitude','services','availability','id_card_front','id_card_back','identification_number','identification_expiry', 'note']},
                    required: true,
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password_hash', 'profile_image', 'email_verified_at', 'suspension_note',]}
            })
        }

        if(result.length > 0){
            result = result.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.serviceman_profile,
                    serviceman_profile: undefined
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched servicemen',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }

}

const getSingleServiceman = async (req, res, next) => {

    try {

        let servicemanProfile = await Serviceman.findOne({
            where: {user_id: req.params.id},
            attributes: {exclude: ['id','updated_at', 'preferences', 'user_id',]}
        })
    
        if(servicemanProfile === null || servicemanProfile === undefined) {
            return next(new errors.NotFoundError('Serviceman not found'))
        }

        const servicemanServicesIds = await ServicemanService.findAll({
            where: {serviceman_id: req.params.id},
            attributes: ['service_item_id']
        })

        let serviceItems = [];

        if(servicemanServicesIds.length > 0) {
            for(let i = 0; i < servicemanServicesIds.length; i++) {
                const serviceItem = await ServiceItem.findByPk(servicemanServicesIds[i].service_item_id, {
                    attributes: {exclude: ['updated_at', 'service_id', 'discount', 'status', 'price']}
                })

                serviceItems.push(serviceItem)
            }
        }

        const result = {
            ...req.resource,
            ...servicemanProfile.toJSON(),
            service_items: serviceItems
        }

        delete result.password_hash
        delete result.updated_at

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched serviceman',
            data: result,
        })
    } catch(e) {
        return next(new errors.InternalServerError())
    }
}

/// API to fetch serviceman activity percentages.
const getServicemanActivity = async (req, res, next) => {

    const servicemanId = req.params.id

    try {
        /// Find average order activity rate
        const totalOrders = await Order.count()

        const totalServicemanOrders = await Order.count({
            where: {serviceman_id: servicemanId}
        })
        let averageActivityRate = 0;

        if(totalServicemanOrders > 0) {
            averageActivityRate = (totalServicemanOrders / totalOrders) * 100
        }

        /// Find Average Spending Amount
        const ordersTotalAmounts = await Order.findAll({
            where: {serviceman_id: servicemanId},
            attributes: ['total_amount']
        })

        let averageSpendingValue = 0
        if(ordersTotalAmounts.length > 0) {
            let totalSpendingValue
            for(let  i = 0; i < ordersTotalAmounts.length; i++) {
                totalSpendingValue += ordersTotalAmounts[i]
            }

            averageSpendingValue = totalSpendingValue / ordersTotalAmounts.length
        }

        /// Find Positive Reviews Rate
        const reviewsGivenToServiceman = await Review.findAll({
            where: {serviceman_id: servicemanId},
            attributes: ['rating_by_customer']
        })

        let positiveReviewRate = 0
        if(reviewsGivenToServiceman.length > 0) {
            let totalPositiveReviews = 0
            for(let i = 0; i < reviewsGivenToServiceman.length; i++) {
                if(reviewsGivenToServiceman >= 3) totalPositiveReviews++
            }

            positiveReviewRate = (totalPositiveReviews / reviewsGivenToServiceman.length) * 100

        }

        /// Find orders success rate
        const totalCompletedOrders = await Order.count({
            where: {
                status: {[Op.or]:['completed']},
                serviceman_id: servicemanId
            }
        })

        let successRate = 0

        if(totalCompletedOrders > 0) {
            successRate = (totalCompletedOrders / totalServicemanOrders) * 100
        }

        /// Find orders cancellation rate
        const totalCancelledOrders = await Order.count({
            where: {
                status: {
                    [Op.or]:['cancelled']
                },
                serviceman_id: servicemanId,
            }
        })

        let cancellationRate = 0

        if(totalCancelledOrders > 0) {
            cancellationRate = (totalCancelledOrders / totalServicemanOrders) * 100
        }

        /// Find highest and lowest amounts order
        const highestAndLowestAmountOrder = await Order.findAll({
            where: {serviceman_id: servicemanId},
            attributes: [
                [fn('MAX', col('total_amount')), 'maxAmount'],
                [fn('MIN', col('total_amount')), 'minAmount']
            ],
            raw: true
        });

        const result = {
            average_activity_rate: averageActivityRate,
            average_spending_value: averageSpendingValue,
            positive_review_rate: positiveReviewRate,
            success_rate: successRate,
            cancellation_rate: cancellationRate,
            total_completed_orders: totalCompletedOrders,
            total_cancelled_orders: totalCancelledOrders,
            total_customer_orders: totalServicemanOrders,
            highest_amount_order: highestAndLowestAmountOrder[0]['maxAmount'] === null ? 0.0 : highestAndLowestAmountOrder[0]['maxAmount'],
            lowest_amount_order: highestAndLowestAmountOrder[0]['minAmount'] === null ? 0.0 : highestAndLowestAmountOrder[0]['minAmount']
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched serviceman activity',
            data: result
        })
    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError())
    }

}

const getServicemenStats = async (req, res, next) => {
    try {
        const total = await User.count({
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        const active = await User.count({
            where: {status: 'active'},
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        const in_active = await User.count({
            where: {
                status: {
                    [Op.or]: ['inactive', 'suspended']
                },
            },
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'serviceman' },
                through: { attributes: [] },
                required: true,
            }]
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched servicemen stats',
            data: {total, active, in_active}
        })

    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

// const getNewServicemenRequests = async (req, res, next) => {
//     const paginationData = setPaginationData({
//         limit: req.query.limit,
//         page: req.query.page,
//     })

//     try {
//         const result = await User.findAll({
//             where: {status: 'pending'},
//             include: [{
//                 association: 'serviceman_profile',
//                 attributes: {exclude: ['updated_at', 'id', 'user_id', 'preferences', 'services', 'longitude', 'zone_id', 'latitude','total_orders', 'earnings','availability']},
//                 required: true,
//             }],
//             attributes: {exclude: ['updated_at','password_hash','rating','suspension_note','profile_image']}
//         })

//         return returnJson({
//             res: res,
//             statusCode: 200,
//             message: 'Fetched new servicemen requests',
//             data: result,
//             limit: paginationData.limit,
//             page: paginationData.page
//         })
//     } catch(e) {
//         return next(new errors.InternalServerError('Internal Server Error. Retry'))
//     }
// }

const updateCustomerDetails = async (req, res, next) => {


}

const changeServicemanStatus = async (req, res, next) => {

    const servicemanId = req.params.id

    const statusDetails = setBodyValues(req.body)

    if(statusDetails.status === undefined || statusDetails.status === null) {
        return next(new errors.BadRequestError('No status provided'))
    }

    if(!UserStatuses.includes(statusDetails.status)) {
        return next(new errors.BadRequestError('Invalid status provided'))
    }

    if(statusDetails.status === 'suspended' && (statusDetails.suspension_note === undefined || statusDetails.suspension_note === null)) {
        return next(new errors.BadRequestError('No suspension note provided'))
    } else if((statusDetails.suspension_note !== undefined && statusDetails.suspension_note !== null) 
            && (statusDetails.status === undefined || statusDetails.status === null)) {
                return next(new errors.BadRequestError('No status provided'))
    }

    try {

        if((req.resource.status === 'active' || req.resource.status === 'inactive' || req.resource.status === 'suspended') && statusDetails.status === 'pending') {
            return next(new errors.BadRequestError('Serviceman with active status can\'t be changed to pending'))
        }

        await User.update({
            status: statusDetails.status,
            suspension_note: statusDetails.status === 'suspended' ? statusDetails.suspension_note : null
        }, {where: {id: servicemanId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Serviceman Status Updated Successfully'
        })

    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

// const changeServicemanAccountSuspension = async (req, res, next) => {
//      const userId = req.params.id
    
//     if((req.resource.status === 'active' || req.resource.status === 'inactive') && (req.body.suspension_note === undefined || req.body.suspension_note === null)) {        
//         return next(new errors.BadRequestError('Suspension note is required'))
//     }

//     try {
//         await User.update({
//             status: req.resource.status === 'active' ? 'suspended' : 'active',
//             suspension_note: req.resource.status === 'active' ? req.body.suspension_note : null
//             }, {where: {id: userId}}
//         )

//         return returnJson({
//             res: res,
//             statusCode: 200,
//             message: 'Serviceman Account Suspension Updated Successfully'
//         })
//     } catch (e) {
//         return next(new errors.InternalServerError('Internal Server Error'))
//     }
// }

// const deleteServiceman = async (req, res, next) => {

//     const userId = req.params.id

//     try {
//         await User.destroy({where: {id: userId}})

//         return returnJson({
//             res: res, 
//             statusCode: 200,
//             message: 'Serviceman Account Deleted Successfully'
//         })
//     } catch (e) {
//         return next(new errors.InternalServerError('Internal Server Error'))
//     }

// }

module.exports = {
  getServicemen,
  getServicemenStats,
  getSingleServiceman,
  updateCustomerDetails,
  changeServicemanStatus,
//   changeServicemanAccountSuspension,
//   deleteServiceman,
  getServicemanActivity,
//   getNewServicemenRequests,

}