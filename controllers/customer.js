const errors = require('../errors/index.js')
const {User, Role} = require('../models')
const { Op } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const setBodyValues = require('../custom_functions/set_body_values.js')
const {UserStatuses} = require('../utils/statuses.js')

const getCustomers = async (req, res, next) => {

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
                    association: 'customer_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id',]},
                    required: true
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at', 'password_hash', 'profile_image']}
            })
        } else {
            result = await User.findAll({
                include: [{
                    association: 'customer_profile',
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id']},
                    required: true
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password_hash', 'profile_image', 'suspension_note']}
            })
        }

        if(result.length > 0){
            result = result.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.customer_profile,
                    customer_profile: undefined
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched customers',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getSingleCustomer = async (req, res, next) => {

    try {

        let result = {}
     
        result = await User.findByPk(req.params.id, {
            include: [{
                association: 'customer_profile',
                attributes: {exclude: ['id','updated_at', 'preferences', 'user_id',]},
                required: true,
            }],
            attributes: {exclude: ['updated_at', 'password_hash']}
        })
    
        if(result === null || result === undefined) {
            return next(new errors.NotFoundError('Customer not found'))
        }

        result = {
            ...result.toJSON(),
            ...result.customer_profile?.toJSON(),
            customer_profile: undefined
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched customer',
            data: result,
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getCustomersStats = async (req, res, next) => {
    try {
        const total = await User.count({
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'customer' },
                through: { attributes: [] },
                required: true,
            }]
        })

        const active = await User.count({
            where: {status: 'active'},
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'customer' },
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
                where: { name: 'customer' },
                through: { attributes: [] },
                required: true,
            }]
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched customer stats',
            data: {total, active, in_active}
        })

    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const updateCustomerDetails = async (req, res, next) => {


}

const changeCustomerStatus = async (req, res, next) => {

    const userId = req.params.id
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
            return next(new errors.BadRequestError('Customer with active status can\'t be changed to pending'))
        }

        await User.update({
            status: statusDetails.status,
            suspension_note: statusDetails.status === 'suspended' ? statusDetails.suspension_note : null
        }, {where: {id: userId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Customer Status Updated Successfully'
        })

    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const changeCustomerAccountSuspension = async (req, res, next) => {
    const userId = req.params.id

    if((req.resource.status === 'active' || req.resource.status === 'inactive') && (req.body.suspension_note === undefined || req.body.suspension_note === null)) {        
        return next(new errors.BadRequestError('Suspension note is required'))
    }

    try {

        await User.update({
            status: req.resource.status === 'active' ? 'suspended' : 'active',
            suspension_note: req.resource.status === 'active' ? req.body.suspension_note : null
            }, {where: {id: userId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Customer Account Suspension Updated Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const deleteCustomer = async (req, res, next) => {

    const userId = req.params.id

    try {
        await User.destroy({where: {id: userId}})

        return returnJson({
            res: res, 
            statusCode: 200,
            message: 'Customer Account Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }

}

module.exports = {
  getCustomers,
  getCustomersStats,
  getSingleCustomer,
  updateCustomerDetails,
  changeCustomerStatus,
  changeCustomerAccountSuspension,
  deleteCustomer,
}