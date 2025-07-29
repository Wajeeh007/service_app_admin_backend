const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const {WithdrawRequests} = require('../models')
const setBodyValuesFunc = require('../custom_functions/set_body_values.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const dayjs = require('dayjs');
const {WithdrawRequestStatus} = require('../utils/statuses.js')

const getWithdrawRequests = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    let status = req.query.status

    if(status !== undefined && status !== null) {
        if(!WithdrawRequestStatus.includes(status) ) {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {

        let result
        if(status) {
            result = await WithdrawRequests.findAll({
                where: {status: status},
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}    
            })
        } else {
            result = await WithdrawRequests.findAll({
                limit: paginationData.limit,
                page: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at', 'note', 'receipt']}    
            })
        }

        return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched withdraw requests',
                limit: paginationData.limit,
                page: paginationData.page,
                data: result,
            })
    } catch(e) {
        console.log(e)
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

const changeWithdrawRequestStatus = async (req, res, next) => {
    const withdrawRequestId = req.params.id

    const withdrawRequestDetails = setBodyValuesFunc(req.body)

    if(!WithdrawRequestStatus.includes(withdrawRequestDetails.status)) {
        return next(new errors.BadRequestError('Invalid status'))
    }

    if(withdrawRequestDetails.status === 'approved' && (withdrawRequestDetails.transfer_date === undefined || withdrawRequestDetails.transfer_date === null || dayjs(req.body.date, dayjs.ISO_8601, true).isValid() === false)) {
        return next(new errors.BadRequestError('Invalid transfer date provided'))
    }

    if(withdrawRequestDetails.status === 'settled' && !req.file) {
        return next(new errors.BadRequestError('No receipt image provided'))
    }

    if(withdrawRequestDetails.status === 'denied' && (withdrawRequestDetails.note === undefined || withdrawRequestDetails.note === null)) {
        return next(new errors.BadRequestError('Invalid admin note text'))
    }

    //TODO: Handle receipt upload

    try {
        
        await WithdrawRequests.update(
            {...withdrawRequestDetails},
            {where: {id: withdrawRequestId},
            fields: withdrawRequestDetails.status === 'approved' ? ['status', 'transfer_date'] : withdrawRequestDetails.status === 'settled' ? ['status', 'transfer_date', 'receipt'] : ['status', 'note']
        },
        
        )

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Withdraw Request Status Updated Successfully',
        })

    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

module.exports = {
    getWithdrawRequests,
    changeWithdrawRequestStatus,
}