const {Review} = require('../models')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const { Op } = require('sequelize')
const returnJson = require('../custom_functions/return_json.js')
const errors = require('../errors/index.js')

/// Reviews given to Serviceman from different customers
const getReviewsToServiceman = async (req, res, next) => {
    const servicemanId = req.params.id

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        let reviews = []

        reviews = await Review.findAll({
            where: {[Op.and]: [
                {serviceman_id: servicemanId},
                {[Op.not]: [{rating_by_customer: null}]}
            ]},
            include: [{
                association: 'customer_review',
                attributes: [['name', 'customer_name']],
                required: true,
            }],
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            attributes: {exclude: ['updated_at', 'serviceman_remarks', 'rating_by_serviceman']}
        })

        if(reviews.length > 0) {
            reviews = reviews.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.customer_profile,
                    customer_profile: undefined,
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched reviews given to serviceman',
            data: reviews,
            limit: paginationData.limit,
            page: paginationData.page
        })

    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

/// Reviews given to different Customers by a single serviceman
const getReviewsByServicemen = async (req, res, next) => {
    const customerId = req.params.id

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        let reviews = []

        reviews = await Review.findAll({
            where: {[Op.and]: [
                {customer_id: customerId}, 
                {[Op.not]: [{rating_by_serviceman: null}]}
            ]},
            include: [{
                association: 'serviceman_review',
                attributes: [['name', 'serviceman_name']],
                required: true,
            }],
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            attributes: {exclude: ['updated_at', 'customer_remarks','rating_by_customer']}
        })

        if(reviews.length > 0) {
            reviews = reviews.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.serviceman_profile,
                    serviceman_profile: undefined,
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched reviews given to customer',
            data: reviews,
            limit: paginationData.limit,
            page: paginationData.page
        })
        
    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

/// Reviews given to Customer from different servicemen
const getReviewsToCustomer = async (req, res, next) => {
    const customerId = req.params.id

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        let reviews = []

        reviews = await Review.findAll({
            where: {[Op.and]: [
                {customer_id: customerId},
                {[Op.not]: [{rating_by_customer: null}, {rating_by_serviceman: null}]}
            ]},
            include: [{
                association: 'serviceman_review',
                attributes: [['name', 'serviceman_name']],
                required: true,
            }],
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            attributes: {exclude: ['updated_at', 'rating_by_customer', 'customer_remarks']}
        })

        if(reviews.length > 0) {
            reviews = reviews.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.serviceman_profile,
                    serviceman_profile: undefined,
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched reviews given to customer',
            data: reviews,
            limit: paginationData.limit,
            page: paginationData.page * paginationData.limit
        })

    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

/// Reviews given to different Servicemen by a single customer
const getReviewsByCustomer = async (req, res, next) => {
    const servicemanId = req.params.id

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
    })

    try {
        let reviews = []
        
        reviews = await Review.findAll({
            where: {[Op.and]: [
                {serviceman_id: servicemanId},
                {[Op.not]: [{rating_by_customer: null}]}
            ]},
            include: [{
                association: 'customer_review',
                attributes: [['name', 'customer_name']],
                required: true,
            }],
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            attributes: {exclude: ['updated_at', 'serviceman_remarks', 'rating_by_serviceman']}
        })

        if(reviews.length > 0) {
            reviews = reviews.map(u => {
                const uJson = u.toJSON();
                return {
                    ...uJson,
                    ...uJson.customer_profile,
                    customer_profile: undefined,
                };
            });
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched reviews given to serviceman',
            data: reviews,
            limit: paginationData.limit,
            page: paginationData.page * paginationData.limit
        })

    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

/// This API fetches the percentages of each rating level.
const getCustomerRatingStats = async (req, res, next) => {
    const customerId = req.params.id

    try {
    
        let ratingStats = []

        for(let i = 0; i <= 4; i++) {
            const rating = await Review.count({
                where: {[Op.and]: [
                    {customer_id: customerId},
                    {rating_by_serviceman: {[Op.gt]: (i - 0.5), [Op.lt]: (i + 0.5)}}
                ]},
            })

            ratingStats.push(rating)
        }
        
        const totalRatings = await Review.count({
            where: {
                [Op.and]: [
                    { customer_id: customerId },
                    { rating_by_serviceman: { [Op.not]: null } }
                ]}
            });
        
        for(let i = 0; i < ratingStats.length; i++) {
            if(ratingStats[i] === undefined || ratingStats[i] === null || ratingStats[i] === 0 || ratingStats[i] === NaN) {
                ratingStats[i] = 0.0
            } else {
                ratingStats[i] = (ratingStats[i]/totalRatings) * 100
            }
        }    

        const result = {
            'one_star': ratingStats[0],
            'two_star': ratingStats[1],
            'three_star': ratingStats[2],
            'four_star': ratingStats[3],
            'five_star': ratingStats[4],
            'total_ratings': totalRatings
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched customer rating stats',
            data: result
        })
    } catch(e) {
        return next(new errors.InternalServerError())
    }
}

const getServicemanRatingStats = async (req, res, next) => {
    const servicemanId = req.params.id

    try {
    
        let ratingStats = []

        for(let i = 0; i <= 4; i++) {
            const rating = await Review.findAll({
                where: {[Op.and]: [
                    {customer_id: servicemanId},
                    {rating_by_customer: {[Op.gt]: (i - 0.5), [Op.lt]: (i + 0.5)}}
                ]},
                attributes: ['rating_by_customer']
            })

            ratingStats.push(rating)
        }

        const totalRatings = await Review.count({
            where: {
                [Op.and]: [
                    { customer_id: servicemanId },
                    { rating_by_customer: { [Op.not]: null } }
                ]}
            });

        for(let i = 0; i < ratingStats.length; i++) {
            if(ratingStats[i] === undefined || ratingStats[i] === null || ratingStats[i] === 0) {
                ratingStats[i] = 0.0
            } else {
                ratingStats[i] = (ratingStats[i]/totalRatings) * 100
            }
        }
        
        const result = {
            'one_star': ratingStats[0],
            'two_star': ratingStats[1],
            'three_star': ratingStats[2],
            'four_star': ratingStats[3],
            'five_star': ratingStats[4],
            'total_ratings': totalRatings
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched serviceman rating stats',
            data: result
        })
    } catch(e) {
        return next(new errors.InternalServerError())
    }
}

module.exports = {
    getReviewsToServiceman,
    getReviewsByServicemen,
    getReviewsToCustomer,
    getReviewsByCustomer,
    getCustomerRatingStats,
    getServicemanRatingStats,

}