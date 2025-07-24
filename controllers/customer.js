const errors = require('../errors/index.js')
const {User, Role} = require('../models')
const { Op } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

const getCustomers = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    const status = req.query.status

    if(status !== undefined && status !== null) {
        if(status !== 'active' && status !== 'in-active' && status !== 'suspended') {
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
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id',]}
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
                    attributes: {exclude: ['id','updated_at', 'preferences', 'user_id']}
                }],
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password_hash', 'profile_image']}
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

const getCustomersStats = async (req, res, next) => {
    try {
        const total = await User.count({
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'customer' },
                through: { attributes: [] }
            }]
        })

        const active = await User.count({
            where: {status: 'active'},
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'customer' },
                through: { attributes: [] }
            }]
        })

        const in_active = await User.count({
            where: {[Op.or]: [{status: 'in-active'}, {status: 'suspended'}]},
            include: [{
                model: Role,
                as: 'roles',
                where: { name: 'customer' },
                through: { attributes: [] }
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

    const customerId = req.params.id

    try {
        const status = await customer.findOne({
            attributes: ['status'],
            where: {id: customerId}
        })

        await customer.update({
            status: status.status === 1 ? 0 : 1
        }, {where: {id: customerId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Customer Status Updated Successfully'
        })

    } catch (e) {

    }
}

const changeCustomerAccountSuspension = async (req, res, next) => {
    const customerId = req.params.id

    try {
        const accountDetails = await customer.findOne({
            attributes: ['account_suspended', 'is_verified'],
            where: {id: customerId}
        })

        await customer.update({
            account_suspended: accountDetails.account_suspended === 1 ? 0 : 1,
            status: accountDetails.account_suspended === 1 && accountDetails.is_verified === 1 ? 1 : 0
        }, {where: {id: customerId}})

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

    const customerId = req.params.id

    try {
        await customer.destroy({where: {id: customerId}})

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
  updateCustomerDetails,
  changeCustomerStatus,
  changeCustomerAccountSuspension,
  deleteCustomer,
}