const returnJson = require('../custom_functions/return_json.js')
const sequelize = require('../custom_functions/db_connection.js')
const errors = require('../errors/index.js')
const formatPolygon = require('../custom_functions/format_polygon.js')
const sqlQueries = require('../utils/sql_queries.js')
const zones = require('../models/zones.js')
const {Sequelize} = require('sequelize')

/// Get zones for listing
const getZones = async (req, res, next) => {
    
    let page = parseInt(req.query.page, 10)
    let limit = parseInt(req.query.limit, 10)

    if(page === undefined || page === null || isNaN(page)) {
        page = 0
    } 
    
    if(limit === undefined || limit === null || limit === 0 || isNaN(limit)) {
        limit = 10
    }

    try {
        let result = await zones.findAll({
            limit: limit,
            offset: page * limit,
            attributes: {exclude: ['created_at', 'updated_at', 'poly_wkt']}
        })

        if(result.length === 0) {
            return next(new errors.NotFoundError('No Zones found'))
        } else {

            result.forEach(zone => {
                zone.polylines = formatPolygon.wktToCoordinates(zone.polylines)
            })
            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Fetched zones',
                data: result
            })
        }
    } catch (e) {
        return next(new errors.CustomError('Error fetching zones'))
    }
}

/// Create new zone
const addZone = async (req, res, next) => {
    let zoneDetails = req.body
    
    if(!zoneDetails.name || !zoneDetails.desc || !zoneDetails.polylines) {
        return next(new errors.BadRequestError('Invalid/Empty data provided'))
    }

    try {
        
        await sequelize.query(sqlQueries.addNewZone, {
                replacements: [
                    zoneDetails.name,
                    zoneDetails.desc, 
                    zoneDetails.polylines
                ]
            });
        
        const lastRow = await zones.findOne({
                order: [['created_at', 'DESC']],
                attributes: {exclude: ['updated_at']}
            });

        let newZone = lastRow[0];
        newZone.polylines = formatPolygon.wktToCoordinates(newZone.polylines)
        return returnJson({
            res: res,
            statusCode: 201,
            message: 'Zone Created Successfully',
            data: newZone
        })        
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Zone already exists'))
        } else if(e instanceof errors.BadRequestError) {
            return next(e)
        } else if(e.parent.errno === 3616 || e.parent.errno === 3617) {
            return next(new errors.BadRequestError('Invalid coordinates provided'))
        } else{
            return next(new errors.CustomError('Internal Server Error'))
        }
    }
}

/// Update an existing zone
const updateZone = async (req, res, next) => {
    
    const zoneDetails = req.body

    let details = {}
    const zoneId = req.params.id

    if(Object.keys(zoneDetails).length === 0 ) {
        return next(new errors.BadRequestError('No data provided to update'))
    } 

    if(zoneDetails.polylines) {
        const wkt = formatPolygon.coordinatesToWKT(zoneDetails.polylines)
        details.polylines = Sequelize.fn(
            'ST_SRID',
            Sequelize.fn('ST_GeomFromText', wkt),
            4326
        );
    }

    if(zoneDetails.name) {
        details.name = zoneDetails.name
    }

    if(zoneDetails.desc) {
        details.desc = zoneDetails.desc
    }


    try {
        await zones.update(
            {...details},
            {
                where: {id: zoneId},
            }
        )
        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Zone Updated Successfully',            
        })
    } catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
            return next(new errors.BadRequestError('Zone with these coordinates already exists'))
        } else if(e instanceof errors.BadRequestError) {
            return next(e)
        } else if(e.parent.errno === 3616 || e.parent.errno === 3617) {
            return next(new errors.BadRequestError('Invalid coordinates provided'))
        } else {
            return next(new errors.CustomError('Internal Server Error'))
        }
    }
}

/// Delete a zone permanently.
const deleteZone = async (req, res, next) => {
    const zoneId = req.params.id

    try {
        await zones.destroy({
            where: {id: zoneId}
        })
        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Zone Deleted Successfully'
        })
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

/// Change the status of the zone to active or in-active
const changeZoneStatus = async (req, res, next) => {
    const zoneId = req.params.id

    try {

        const status = await zones.findOne({
            attributes: ['status'],
            where: {id: zoneId}
        })
        
        await zones.update(
            {status: status.status === 1 ? 0 : 1},
            {
                where: {id: zoneId},
            })
        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Zone Status Updated Successfully'
        })
    } catch (e) {
        return next(new errors.CustomError('Internal Server Error'))
    }
}

module.exports = {
    addZone,
    getZones,
    updateZone,
    deleteZone,
    changeZoneStatus,
}