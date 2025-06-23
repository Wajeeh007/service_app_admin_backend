const CustomError = require('./custom_error')

class InternalServerError extends CustomError {
    constructor(message) {
        super(message)
        this.statusCode = 500
    }
}

module.exports = InternalServerError