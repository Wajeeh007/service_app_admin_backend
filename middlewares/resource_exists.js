const sequelize = require('../custom_functions/db_connection.js')
const errors = require('../errors/index.js')
const { Sequelize } = require('sequelize')

function resourceExists(table_name) {
    return async function(req, res, next) {
        try {
            const resource = await sequelize.query(`SELECT * FROM ${table_name} WHERE id = ?`, {
                replacements: [req.params.id],
                type: Sequelize.QueryTypes.SELECT 
            })

            if(resource === undefined || resource === null || resource.length === 0) {
                return next(new errors.NotFoundError('Resource not found'))
            } else {
                req.resource = resource[0]
            }

            next()
        } catch (e) {
            return next(new errors.CustomError('Internal Server Error. Retry'))
        }
    }
} 

module.exports = resourceExists