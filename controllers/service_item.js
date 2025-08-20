const {SubService, ServiceItem} = require('../models')
const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const subServiceController = require('./sub_service.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const setBodyValuesFunc = require('../custom_functions/set_body_values.js')

/// Get service items.
const getServiceItems = async (req, res, next) => {

    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page
    })

    try {
        const result = await ServiceItem.findAll({
            limit: paginationData.limit,
            offset: paginationData.page * paginationData.limit,
            include: [{
                association: 'sub_service',
                attributes: ['id', 'name'],
                required: true,
            }],
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
                limit: paginationData.limit,
                page: paginationData.page,
                data: result,
            })
        }
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error. Retry'))
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

        serviceItemDetails = setBodyValuesFunc(req.body)

        serviceItemDetails.image = 'https://dummy_image_url.jpg'

        const subServiceDetails = await SubService.findOne({
            attributes: ['name', 'service_id'],
            where: {id: serviceItemDetails.sub_service_id}
        })

        if(subServiceDetails.name && subServiceDetails.service_id) {

            serviceItemDetails.sub_service_name = subServiceDetails.name
            serviceItemDetails.service_id = subServiceDetails.service_id

            const newServiceItem = await ServiceItem.create(
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

            return returnJson({
                res: res,
                statusCode: 201,
                message: 'Service Item Added Successfully',
                data: newServiceItem
            })
        } else {
            return next(new errors.BadRequestError('Invalid Sub-Service selected'))
        }
        
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service item with this name already exists'))
        }
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

/// Update an existing service item.
//TODO: Add code for image handling.
const updateServiceItem = async (req, res, next) => {

    if(req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
        return next(new errors.BadRequestError('Invalid/Empty data'))
    }

    let serviceItemDetails = {}

    try {

        serviceItemDetails = setBodyValuesFunc(req.body)

        /// Add code to update service items when service ID is changed.

        if(serviceItemDetails.sub_service_id) {
            const oldIds = await ServiceItem.findOne({
                attributes: ['sub_service_id'],
                where: {id: req.params.id}
            })

            req.body.sub_service_id = oldIds.sub_service_id

            const newSubServiceName = await SubService.findOne({
            attributes: ['name', 'service_id'],
            where: {id: serviceItemDetails.sub_service_id}})
        
            if(newSubServiceName !== null && newSubServiceName !== undefined && newSubServiceName.name && newSubServiceName.service_id) {

                serviceItemDetails.sub_service_name = newSubServiceName.name
                serviceItemDetails.service_id = newSubServiceName.service_id

                if(req.body.oldServiceId) {
                    await subServiceController.decrementServiceItemNo(req, res, next)
                    await subServiceController.incrementServiceItemNo(req, res, next)
                }
            } else {
                return next(new errors.BadRequestError('Invalid Service ID'))
            }
            
            await ServiceItem.update(
                {...serviceItemDetails},
                {where: {id: req.params.id}}
            )

            const serviceItemResult = await ServiceItem.findByPk(req.params.id)

            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Item Updated Successfully',
                data: serviceItemResult,
            })
        } 
    } catch (e) {
        console.log(e)
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service Item with this name already exists'))
        }
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

/// Change Sub-Service status to active or in-active
const changeServiceItemStatus = async (req, res, next) => {

    const serviceItemId = req.params.id

    try {
        const status = await ServiceItem.findOne({
            attributes: ['status'],
            where: {id: serviceItemId}
        })
        
        await ServiceItem.update(
            {status: status.status === 1 ? 0 : 1},
            {where: {id: serviceItemId}}
        )

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Item Status Updated Successfully'
        })
    } catch(e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

/// Delete an existing service item.
const deleteServiceItem = async (req, res, next) => {
    const serviceItemId = req.params.id

    try {
        const subServiceId = await ServiceItem.findOne({
            attributes: ['sub_service_id'],
            where: {id: serviceItemId}
        })

        req.body.oldIds = {sub_service_id: subServiceId.sub_service_id}

        await subServiceController.decrementServiceItemNo(req, res, next)

        await ServiceItem.destroy({where: {sub_service_id: serviceItemId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Item Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.InternalServerError('Internal Server Error'))
    }
}

module.exports = {
    getServiceItems,
    addServiceItem,
    updateServiceItem,
    changeServiceItemStatus,
    deleteServiceItem,
}