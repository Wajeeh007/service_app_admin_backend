const subService = require('../models/sub_service.js')
const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const serviceController = require('./service.js')
const serviceItem = require('../models/service_item.js')
const service = require('../models/service.js')

const getSubServices = async (req, res, next) => {

    let page = parseInt(req.query.page, 10)
    let limit = parseInt(req.query.limit, 10)

    let includeLimits = true;

    if((limit === undefined && page === undefined) || (limit === null && page === null) || (isNaN(limit) && isNaN(page))) {
        includeLimits = false
    } else {
        if(page === undefined || page === null || isNaN(page)) {
            page = 0
        } 
        
        if(limit === undefined || limit === null || limit === 0 || isNaN(limit)) {
            limit = 10
        }
    }

    try {
        const result = await subService.findAll({
            limit: includeLimits ? limit : null,
            offset: includeLimits ? page * limit : null,
            order: [['created_at', 'ASC']],
            attributes: includeLimits ? {exclude:  ['updated_at']} : ['id', 'name']
        })

        if(result.length === 0){
            return next(new errors.NotFoundError('No Sub-Services found'))
        } else {
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched sub-services',
                limit: includeLimits ? limit : undefined,
                page: includeLimits ? page : undefined,
                data: result,
            })
        }
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error. Retry'))
    }
}

/// Add new sub-service with the provided details
//TODO: Add code for handling image upload.
const addSubService = async (req, res, next) => {

    if(!req.body.name || !req.body.service_id) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let subServiceDetails = {}
    
    try {

        for(var i = 0; i < Object.keys(req.body).length; i++) {
            subServiceDetails[Object.keys(req.body)[i]] = Object.values(req.body)[i]
        }

        subServiceDetails.image = 'https://dummy_image_url.jpg'

        const serviceName = await service.findOne({
            attributes: ['name'],
            where: {id: subServiceDetails.service_id}
        })

        if(serviceName.name) {

            subServiceDetails.service_type = serviceName.name

            await subService.create(
                subServiceDetails,
                {fields: ['name', 'service_id', 'service_name','image']})

            await serviceController.incrementSubServicesNo(req, res, next)

            const lastRow = await subService.findOne({
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at']}
            });

            return returnJson({
                res: res,
                statusCode: 201,
                message: 'Sub-Service Added Successfully',
                data: lastRow
            })
        } else {
            return next(new errors.BadRequestError('Invalid Service ID'))
        }
        
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Sub-Service with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }

}

/// Update an existing sub-service.
//TODO: Add code for image handling.
const updateSubService = async (req, res, next) => {

    if(!req.body.name && !req.body.service_id) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let subServiceDetails = req.body

    try {

        for(var i = 0; i < Object.keys(req.body).length; i++) {
            subServiceDetails[Object.keys(req.body)[i]] = Object.values(req.body)[i]
        }

        /// Add code to update service items when service ID is changed.

        if(subServiceDetails.service_id) {
            const oldServiceId = await subService.findOne({
                attributes: ['service_id'],
                where: {id: req.params.id}
            })

            req.body.oldServiceId = oldServiceId.service_id
        }

        const newServiceName = await service.findOne({
            attributes: ['name'],
            where: {id: subServiceDetails.service_id}
        })

        if(newServiceName.name) {

            subServiceDetails.service_type = newServiceName.name

            await subService.update(
            {...subServiceDetails},
            {where: {id: req.params.id}}
        )

            if(req.body.oldServiceId) {
                await serviceController.decrementSubServicesNo(req, res, next)
                await serviceController.incrementSubServicesNo(req, res, next)
            }

            const subServiceResult = await subService.findByPk(req.params.id)

            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Sub-Service Updated Successfully',
                data: subServiceResult
            })
        } else {
            return next(new errors.BadRequestError('Invalid Service ID'))
        }
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Sub-Service with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Change Sub-Service status to active or in-active
const changeSubServiceStatus = async (req, res, next) => {

    const subServiceId = req.params.id

    try {
        const status = await subService.findOne({
            attributes: ['status'],
            where: {id: subServiceId}
        })
        
        await subService.update(
            {status: status.status === 1 ? 0 : 1},
            {where: {id: subServiceId}}
        )

        if(status.status === 1) {
            await serviceItem.update(
                {status: status.status === 1 ? 0 : 1},
                {where: {sub_service_id: subServiceId}}
            )
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Sub-Service Status Updated Successfully'
        })
    } catch(e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Delete an existing sub-service and associated service items.
const deleteSubService = async (req, res, next) => {
    const subServiceId = req.params.id

    try {

        const oldServiceId = await subService.findOne({
            attributes: ['service_id'],
            where: {id: req.params.id}
        })

        req.body.oldServiceId = oldServiceId.service_id

        await subService.destroy({
            where: {id: subServiceId}
        })

        await serviceController.decrementSubServicesNo(req, res, next)

        await serviceItem.destroy({where: {sub_service_id: subServiceId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Sub-Service Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Increment the number of associated service item by one when a new item is added under this sub-service.
const incrementServiceItemNo = async(req, res, next) => {
    
    const associatedServiceItemsNo = await subService.findOne({
        where: {id: req.body.sub_service_id},
        attributes: ['total_associated_items']
    })

    await subService.update({
        total_associated_items: associatedServiceItemsNo.total_associated_items + 1},
        {where: {id: req.body.sub_service_id}}
    )
}

/// Decrement the number of associated service items by one when a new item is added under this service.
const decrementServiceItemNo = async(req, res, next) => {
    
    const associatedServiceItemsNo = await subService.findOne({
        attributes: ['total_associated_items'],
        where: {id: req.body.oldIds.sub_service_id},
    })

    await subService.update({
        total_associated_items: associatedServiceItemsNo.total_associated_items - 1},
        {where: {id: req.body.oldIds.sub_service_id}}
    )
}

module.exports = {
    getSubServices,
    addSubService,
    updateSubService,
    changeSubServiceStatus,
    deleteSubService,
    incrementServiceItemNo,
    decrementServiceItemNo,
}