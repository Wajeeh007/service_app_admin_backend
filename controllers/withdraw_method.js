const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const withdrawMethod = require('../models/withdraw_method.js')
const setBodyValuesFunc = require('../custom_functions/set_body_values.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

/// Get withdraw methods.
const getWithdrawMethods = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    const status = parseInt(req.query.status, 10)

    if(req.query.status) {
        if(isNaN(status) || status > 1 || status < 0) {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {
        let result = {}

        if(req.query.status) {
            result = await withdrawMethod.findAll({
                where: {status: req.query.status},
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}    
            })
        } else {
            result = await withdrawMethod.findAll({
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}
            })
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched withdraw methods',
            limit: paginationData.limit,
            page: paginationData.page,
            data: result,
        })
    
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const addWithdrawMethod = async (req, res, next) => {
    // if(req.body.name && req.body.field_type && req.body.field_name && req.body.placeholder_text) {
    //     return next(new errors.BadRequestError('Invalid/Empty data provided'))
    // }

    let withdrawMethodDetails = {}

    try {

        withdrawMethodDetails = setBodyValuesFunc(req.body)

        withdrawMethodDetails.field_type = withdrawMethodDetails.field_type.toLowerCase()
        if(withdrawMethodDetails.status) delete withdrawMethodDetails.status

        if(withdrawMethodDetails.is_default && parseInt(withdrawMethodDetails.is_default) === 1) {
            await withdrawMethod.update(
                {is_default: 0},
                {where: {is_default: 1},
                fields: ['is_default']
            })
        }

        const newWithdrawMethod = await withdrawMethod.create(
            withdrawMethodDetails,
            {fields: ['name', 'field_type', 'field_name', 'placeholder_text', 'is_default', 'status']}
        )

        return returnJson({
            res: res,
            statusCode: 201,
            message: 'Withdraw Method Added Successfully',
            data: newWithdrawMethod
        }) 

    } catch(e) {

        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Withdraw method with this name already exists'))
        }

        if(e.parent.sqlState === '45000') {
            return next(new errors.BadRequestError('Invalid data provided for field is_default'))
        }

        if(e.parent.errno === 1265) {
            return next(new errors.BadRequestError('Invalid data provided for Field Type'))
        }

        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const updateWithdrawMethod = async (req, res, next) => {

    if(req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
        return next(new errors.BadRequestError('Invalid/Empty data'))
    }

    let withdrawMethodDetails = {}

    try {

        withdrawMethodDetails = setBodyValuesFunc(req.body)
        const withdrawMethodDetailsInDB = await withdrawMethod.findByPk(req.params.id)

        if(withdrawMethodDetailsInDB.is_default === 1 && parseInt(withdrawMethodDetails.is_default) === 0) {
            return next(new errors.BadRequestError('Cannot change default withdraw method status. Set new default method first'))
        }

        if(withdrawMethodDetails.is_default && parseInt(withdrawMethodDetails.is_default) === 1 && withdrawMethodDetailsInDB.status === 1) {
            await withdrawMethod.update(
                {is_default: 0},
                {where: {is_default: 1}
            }) 
        } else if(parseInt(withdrawMethodDetails.is_default) > 1 || parseInt(withdrawMethodDetails.is_default) < 0) {
            return next(new errors.BadRequestError('Invalid data provided for field is_default'))
        } else if(withdrawMethodDetailsInDB.status === 0 && parseInt(withdrawMethodDetails.is_default) === 1) {
            return next(new errors.BadRequestError('Cannot set an In-Active method as the default method'))
        }

        if(withdrawMethodDetails.field_type) withdrawMethodDetails.field_type = withdrawMethodDetails.field_type.toLowerCase()

        if(withdrawMethodDetails.status) delete withdrawMethodDetails.status
        
        await withdrawMethod.update(
            {...withdrawMethodDetails},
            {where: {id: req.params.id}
        })

        const result = await withdrawMethod.findByPk(req.params.id)

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Withdraw Method Updated Successfully',
            data: result
        })
    } catch (e) {

        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.DuplicateEntryError('Withdraw method with this name already exists'))
        }

        if(e.parent.sqlState === '45000') {
            return next(new errors.BadRequestError('Invalid data provided for field is_default'))
        }

        if(e.parent.errno === 1265) {
            return next(new errors.BadRequestError('Invalid data provided for Field Type'))
        }

        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const changeWithdrawMethodStatus = async (req, res, next) => {
    const withdrawMethodId = req.params.id

    try {
        const withdrawMethodDetails = await withdrawMethod.findOne({
            attributes: ['status', 'is_default'],
            where: {id: withdrawMethodId}
        })
        
        if(parseInt(withdrawMethodDetails.is_default) === 1) {
            return next(new errors.BadRequestError('Cannot change status of default method'))
        }

        await withdrawMethod.update(
            {status: withdrawMethodDetails.status === 1 ? 0 : 1},
            {where: {id: withdrawMethodId}}
        )

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Withdraw Method Status Updated Successfully',
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const deleteWithdrawMethod = async (req, res, next) => {
    const withdrawMethodId = req.params.id

    try {

        const isDefault = await withdrawMethod.findOne({
            attributes: ['is_default'],
            where: {id: withdrawMethodId}
        })

        if(isDefault.is_default === 1) { 
            return next(new errors.BadRequestError('Cannot delete default withdraw method. Set new default method first'))
        }

        await withdrawMethod.destroy({where: {id: withdrawMethodId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Withdraw Method Deleted Successfully',
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

module.exports = {
    getWithdrawMethods,
    addWithdrawMethod,
    updateWithdrawMethod,
    changeWithdrawMethodStatus,
    deleteWithdrawMethod
}