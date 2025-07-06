const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const withdrawRequest = require('../models/withdraw_request.js')
const setBodyValuesFunc = require('../custom_functions/set_body_values.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')

const getWithdrawRequests = async (req, res, next) => {
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    let status

    if(req.query.status) {
        if(req.query.status === 'pending' || req.query.status === 'approved' || req.query.status === 'settled' || req.query.status === 'denied') {
            status = req.query.status
        } else {
            return next(new errors.BadRequestError('Invalid status provided'))
        }
    }

    try {

        let result
        if(status) {
            result = await withdrawRequest.findAll({
                where: {status: status},
                limit: paginationData.limit,
                offset: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}    
            })
        } else {
            result = await withdrawRequest.findAll({
                limit: paginationData.limit,
                page: paginationData.page * paginationData.limit,
                order: [['created_at', 'ASC']],
                attributes: {exclude:  ['updated_at']}    
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
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
    }
}

module.exports = {
    getWithdrawRequests,
    
}