const errors = require('../errors/index.js')
const serviceman = require('../models/serviceman.js')
const { Op } = require("sequelize");
const returnJson = require('../custom_functions/return_json.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

const getServicemen = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    const status = parseInt(req.query.status, 10)

    if(status !== undefined && status !== null && !isNaN(status) && (parseInt(req.query.status, 10) > 1) || (parseInt(req.query.status, 10) < 0)) {
        return next(new errors.BadRequestError('Invalid status provided'))
    }

    try {

        let result = {}

        if(status !== undefined && status !== null && !isNaN(status)) {
            result = await serviceman.findAll({
                where: {status: status, account_suspended: 0},
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password']}
            })
        } else {
            result = await serviceman.findAll({
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'DESC']],
                attributes: {exclude:  ['updated_at', 'password']}
            })
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

const getServicemenStats = async (req, res, next) => {
    try {
        const total = await serviceman.count()

        const active = await serviceman.count({
            where: {[Op.and]: [{ status: 1 }, { account_suspended: 0 }, {is_verified: 1}],}
        })

        const in_active = await serviceman.count({
            where: {[Op.or]: [{ account_suspended: 1 }],}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched servicemen stats',
            data: {total, active, in_active}
        })

    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getNewServicemenRequests = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        const result = await serviceman.findAll({
            where: {[Op.and]: [{ status: 0}, { account_suspended: 0 }, {is_verified: 0}]}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched new servicemen requests',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const getSuspendedServicemen = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        const result = await serviceman.findAll({
            where: { account_suspended: 1}
        })

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched suspended servicemen',
            data: result,
            limit: paginationData.limit,
            page: paginationData.page
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const updateCustomerDetails = async (req, res, next) => {


}

const changeServicemanStatus = async (req, res, next) => {

    const servicemanId = req.params.id

    try {
        const status = await serviceman.findOne({
            attributes: ['status'],
            where: {id: servicemanId}
        })

        await serviceman.update({
            status: status.status === 1 ? 0 : 1
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

const changeServicemanAccountSuspension = async (req, res, next) => {
    const servicemanId = req.params.id

    try {
        const accountDetails = await serviceman.findOne({
            attributes: ['account_suspended', 'is_verified'],
            where: {id: servicemanId}
        })

        await serviceman.update({
            account_suspended: accountDetails.account_suspended === 1 ? 0 : 1,
            status: accountDetails.account_suspended === 1 && accountDetails.is_verified === 1 ? 1 : 0
        }, {where: {id: servicemanId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Serviceman Account Suspension Updated Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const deleteServiceman = async (req, res, next) => {

    const servicemanId = req.params.id

    try {
        await serviceman.destroy({where: {id: servicemanId}})

        return returnJson({
            res: res, 
            statusCode: 200,
            message: 'Serviceman Account Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }

}

module.exports = {
  getServicemen,
  getServicemenStats,
  updateCustomerDetails,
  changeServicemanStatus,
  changeServicemanAccountSuspension,
  deleteServiceman,
  getNewServicemenRequests,
  getSuspendedServicemen,

}