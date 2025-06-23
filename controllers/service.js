const service = require('../models/service.js')
const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const subService = require('../models/sub_service.js')
const serviceItem = require('../models/service_item.js')
const sequelize = require('../custom_functions/db_connection.js')
const sqlQueries = require('../utils/sql_queries.js')
const setPaginationData = require('../custom_functions/set_pagination_data.js')
const setBodyValuesFunc = require('../custom_functions/set_body_values.js')

/// Fetch services.
const getServices = async (req, res, next) => {
    
    const paginationData = setPaginationData({
        limit: req.query.limit,
        page: req.query.page,
        includePagination: false,
    })

    try {
        const result = await service.findAll({
            limit: paginationData.includeLimits ? paginationData.limit : null,
            offset: paginationData.includeLimits ? paginationData.page * paginationData.limit : null,
            attributes: paginationData.includeLimits ? {exclude:  ['updated_at']} : ['id', 'name']
        })

        if(result.length === 0){
            return next(new errors.NotFoundError('No Services found'))
        } else {
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched services',
                limit: paginationData.includeLimits ? paginationData.limit : undefined,
                page: paginationData.includeLimits ? paginationData.page : undefined,
                data: result,
            })
        }
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error. Retry'))
    }
}

/// Add new service with the provided details
//TODO: Add code for handling image upload.
const addNewService = async (req, res, next) => {

    if(!req.body.name || !req.body.desc) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let serviceDetails = {}

    try {

        serviceDetails = setBodyValuesFunc(req.body)

        const newService = await service.create(
            serviceDetails,
            {fields: ['name', 'desc', 'image']})

        return returnJson({
            res: res,
            statusCode: 201,
            message: 'Service Added Successfully',
            data: newService,
        })
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Update an existing service.
//TODO: Add code for image handling.
const updateService = async (req, res, next) => {

    if(!req.body.name && !req.body.desc) {
        return next(new errors.BadRequestError('Invalid/Empty data')) 
    }

    let serviceDetails = {}
    
    try {

        serviceDetails = setBodyValuesFunc(req.body)

        await service.update(
            {...serviceDetails},
            {where: {id: req.params.id}}
        )

        const result = await service.findByPk(req.params.id)

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Updated Successfully',
            data: result
        })
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Service with this name already exists'))
        }
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Change Service status to active or in-active, 
// and consequently change the status of all the sub-service and service items associated
// with this service, if the status is being changed to in-active.
const changeServiceStatus = async (req, res, next) => {

    const serviceId = req.params.id

    try {
        const status = await service.findOne({
            attributes: ['status'],
            where: {id: serviceId}
        })
        
        if(status.status) {
            await service.update(
            {status: status.status === 1 ? 0 : 1},
            {where: {id: serviceId}})

            if(status.status === 1){
            await subService.update(
                {status: 0},
                {where: {service_id: serviceId}})

            await serviceItem.update(
                {status: status.status === 1 ? 0 : 1},
                {where: {service_id: serviceId}})
            }
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Status Updated Successfully'
        })
    } catch(e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Delete an existing service and all the sub-services and service items associated with it.
const deleteService = async (req, res, next) => {
    const serviceId = req.params.id

    try {
        await service.destroy({where: {id: serviceId}})

        await subService.destroy({where: {service_id: serviceId}})

        await serviceItem.destroy({where: {service_id: serviceId}})

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Increment the number of associated sub-services by one when a new sub-service is added
/// to under this service.
const incrementSubServicesNo = async(req, res, next) => {
    
    const associatedSubServicesNo = await service.findOne({
        where: {id: req.body.service_id},
        attributes: ['total_associated_services']
    })

    await service.update({
        total_associated_services: associatedSubServicesNo.total_associated_services + 1},
        {where: {id: req.body.service_id}}
    )
}

/// Decrement the number of associated sub-services by one when a new sub-service is added
/// to under this service.
const decrementSubServicesNo = async(req, res, next) => {
    
    const associatedSubServicesNo = await service.findOne({
        attributes: ['total_associated_services'],
        where: {id: req.body.oldServiceId},
    })

    await service.update({
        total_associated_services: associatedSubServicesNo.total_associated_services - 1},
        {where: {id: req.body.oldServiceId}}
    )
}

module.exports = {
    getServices,
    addNewService,
    updateService,
    changeServiceStatus,
    deleteService,
    incrementSubServicesNo,
    decrementSubServicesNo
}