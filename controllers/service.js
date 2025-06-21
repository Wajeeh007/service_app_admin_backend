const service = require('../models/service.js')
const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const subService = require('../models/sub_service.js')
const serviceItem = require('../models/service_item.js')
const sequelize = require('../custom_functions/db_connection.js')
const sqlQueries = require('../utils/sql_queries.js')

/// Fetch services.
const getServices = async (req, res, next) => {
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
        const result = await service.findAll({
            limit: includeLimits ? limit : null,
            offset: includeLimits ? page * limit : null,
            attributes: includeLimits ? {exclude:  ['updated_at']} : ['id', 'name']
        })

        if(result.length === 0){
            return next(new errors.NotFoundError('No Services found'))
        } else {
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched services',
                limit: includeLimits ? limit : undefined,
                page: includeLimits ? page : undefined,
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

    try {
        await sequelize.query(sqlQueries.addNewService, {
            replacements: [
                req.body.name,
                req.body.desc,
                'https://test_image_url.png'
            ]
        })
            
        const lastRow = await service.findOne({
            order: [['id', 'DESC']],
        });

        return returnJson({
            res: res,
            statusCode: 201,
            message: 'Service Added Successfully',
            data: lastRow
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

    const updatedDetails = req.body
    
    try {

        await service.update(
            {...updatedDetails},
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
        
        if(status) {
            await service.update(
            {status: status.status === 1 ? 0 : 1},
            {where: {id: serviceId}}
        )

        if(status.status === 1){
            await subService.update(
                {status: 0},
                {where: {service_id: serviceId}}
            )

            await serviceItem.update(
                {status: status.status === 1 ? 0 : 1},
                {where: {service_id: serviceId}}
            )
        }
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Service Status Updated Successfully'
        })
    } catch(e) {
        console.log(e)
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