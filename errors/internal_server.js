const CustomError = require('./custom_error')

class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
        super(message)
        this.statusCode = 500
    }
}

module.exports = InternalServerError