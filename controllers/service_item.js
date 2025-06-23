const subService = require('../models/sub_service.js')
const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const subServiceController = require('./sub_service.js')
const serviceItem = require('../models/service_item.js')

/// Get service items.
const getServiceItems = async (req, res, next) => {

    let page = parseInt(req.query.page, 10)
    let limit = parseInt(req.query.limit, 10)

    if(page === undefined || page === null || isNaN(page)) {
        page = 0
    } 
        
    if(limit === undefined || limit === null || limit === 0 || isNaN(limit)) {
        limit = 10
    }

    try {
        const result = await serviceItem.findAll({
            limit: limit,
            offset: page * limit,
            order: [['created_at', 'ASC']],
            attributes: {exclude:  ['updated_at']}
        })

        if(result.length === 0){
            return next(new errors.NotFoundError('No Service Item found'))
        } else {
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched service items',
                limit: limit,
                page: page,
                data: result,
            })
        }
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error. Retry'))
    }
}

/// Add new service item with the provided details
//TODO: Add code for handling image upload.
const addServiceItem = async (req, res, next) => {

    if(!req.body.name || !req.body.sub_service_id) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let serviceItemDetails = {}
    
    try {

        for(var i = 0; i < Object.keys(req.body).length; i++) {
            serviceItemDetails[Object.keys(req.body)[i]] = Object.values(req.body)[i]
        }

        serviceItemDetails.image = 'https://dummy_image_url.jpg'

        const subServiceDetails = await subService.findOne({
            attributes: ['name', 'service_id'],
            where: {id: serviceItemDetails.sub_service_id}
        })

        if(subServiceDetails.name && subServiceDetails.service_id) {

            serviceItemDetails.sub_service_name = subServiceDetails.name
            serviceItemDetails.service_id = subServiceDetails.service_id

            await serviceItem.create(
                serviceItemDetails,
                {fields: [
                    'name',
                    'sub_service_id', 
                    'service_id', 
                    'sub_service_name', 
                    'image',
                    'price'
                ]})

            await subServiceController.incrementServiceItemNo(req, res, next)

            const lastRow = await serviceItem.findOne({
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at']}
            });

            return returnJson({
                res: res,
                statusCode: 201,
                message: 'Service Item Added Successfully',
                data: lastRow
            })
        } else {
            return next(new errors.BadRequestError('Invalid Sub-Service selected'))
        }
        
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service item with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Update an existing service item.
//TODO: Add code for image handling.
const updateServiceItem = async (req, res, next) => {

    if(!req.body.name && !req.body.sub_service_id) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let serviceItemDetails = req.body

    try {

        for(var i = 0; i < Object.keys(req.body).length; i++) {
            serviceItemDetails[Object.keys(req.body)[i]] = Object.values(req.body)[i]
        }

        /// Add code to update service items when service ID is changed.

        if(serviceItemDetails.sub_service_id) {
            const oldIds = await serviceItem.findOne({
                attributes: ['sub_service_id'],
                where: {id: req.params.id}
            })

            req.body.sub_service_id = oldIds.sub_service_id
        }

        const newSubServiceName = await subService.findOne({
            attributes: ['name', 'service_id'],
            where: {id: serviceItemDetails.sub_service_id}
        })

        if(newSubServiceName.name && newSubServiceName.service_id) {

            serviceItemDetails.sub_service_name = newSubServiceName.name
            serviceItemDetails.service_id = newSubServiceName.service_id

            await subService.update(
            {...serviceItemDetails},
            {where: {id: req.params.id}}
        )

            if(req.body.oldServiceId) {
                await subServiceController.decrementServiceItemNo(req, res, next)
                await subServiceController.incrementServiceItemNo(req, res, next)
            }

            const serviceItemResult = await serviceItem.findByPk(req.params.id)

            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Item Updated Successfully',
                data: serviceItemResult,
            })
        } else {
            return next(new errors.BadRequestError('Invalid Service ID'))
        }
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service Item with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Change Sub-Service status to active or in-active
const changeServiceItemStatus = async (req, res, next) => {

    const serviceItemId = req.params.id

    try {
        const status = await serviceItem.findOne({
            attributes: ['status'],
            where: {id: serviceItemId}
        })
        
        await serviceItem.update(
            {status: status.status === 1 ? 0 : 1},
            {where: {id: serviceItemId}}
        )

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Item Status Updated Successfully'
        })
    } catch(e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Delete an existing service item.
const deleteServiceItem = async (req, res, next) => {
    const serviceItemId = req.params.id

    try {
        const subServiceId = await serviceItem.findOne({
            attributes: ['sub_service_id'],
            where: {id: serviceItemId}
        })

        req.body.oldIds = {sub_service_id: subServiceId.sub_service_id}

        await subServiceController.decrementServiceItemNo(req, res, next)

        await serviceItem.destroy({where: {sub_service_id: serviceItemId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Item Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

module.exports = {
    getServiceItems,
    addServiceItem,
    updateServiceItem,
    changeServiceItemStatus,
    deleteServiceItem,
}