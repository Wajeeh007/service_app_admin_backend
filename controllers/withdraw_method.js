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

    try {

        if(req.query.status) {
            const result = await withdrawMethod.findAll({
                where: {status: req.query.status},
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}    
            })
            
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched withdraw methods',
                limit: paginationData.limit,
                page: paginationData.page,
                data: result,
            })

        }

        const result = await withdrawMethod.findAll({
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            order: [['created_at', 'ASC']],
            attributes: {exclude:  ['updated_at']}
        })

        if(result.length === 0){
            return next(new errors.NotFoundError('No Withdraw method found'))
        } else {
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched withdraw methods',
                limit: paginationData.limit,
                page: paginationData.page,
                data: result,
            })
        }
    
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const addWithdrawMethod = async (req, res, next) => {
    if(!req.body.name || !req.body.field_type || !req.body.field_name || !req.body.placeholder_text) {
        return next(new errors.BadRequestError('Invalid/Empty data provided'))
    }

    let withdrawMethodDetails = {}

    try {

        withdrawMethodDetails = setBodyValuesFunc(req.body)

        const newWithdrawMethod = await withdrawMethod.create(
            withdrawMethodDetails,
            {fields: ['name', 'field_type', 'field_name', 'placeholder_text', 'is_default']}
        )

        if(withdrawMethodDetails.is_default) {
            await withdrawMethod.update(
                {is_default: 0},
                {where: {is_default: 1}
            })
        }

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
            return next(new errors.BadRequestError('Invalid data provided'))
        }

        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

const updateWithdrawMethod = async (req, res, next) => {

}

const changeWithdrawMethodStatus = async (req, res, next) => {

}

const deleteWithdrawMethod = async (req, res, next) => {

}

module.exports = {
    getWithdrawMethods,
    addWithdrawMethod,
    updateWithdrawMethod,
    changeWithdrawMethodStatus,
    deleteWithdrawMethod
}