const sequelize = require('../custom_functions/db_connection.js')
const errors = require('../errors/index.js')
const { Sequelize } = require('sequelize')

function resourceExists(table_name, addDataToReq = true) {
    return async function(req, res, next) {
        try {
            const resource = await sequelize.query(`SELECT * FROM ${table_name} WHERE id = ?`, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT,
                 
            })

            if(resource === undefined || resource === null || resource.length === 0) {
                return next(new errors.NotFoundError('Resource not found'))
            } else {
                if(addDataToReq) req.resource = resource[0]
            }

            next()
        } catch (e) {
            if(e.parent !== undefined && e.parent.errno !== undefined && e.parent.errno === 1146) {
                return next(new errors.BadRequestError('Resource not found'))
            }
            return next(new errors.CustomError('Internal Server Error. Retry'))
        }
    }
} 

module.exports = resourceExists