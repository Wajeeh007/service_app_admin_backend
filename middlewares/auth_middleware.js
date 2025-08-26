require('dotenv').config()
const jwt = require('jsonwebtoken')
const errors = require('../errors/index.js')

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new errors.UnauthenticatedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    if(!token) {
        throw new errors.BadRequestError('Invalid Token')
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.tokenData = decoded
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            /// Don't change this message. This message is used to route the user back to login screen.
            throw new errors.UnauthenticatedError('Expired Token')
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new errors.UnauthenticatedError('Invalid Token') 
        } else {
            throw new errors.UnauthenticatedError('Token verification failed. Retry')
        }
    }
}

module.exports = authMiddleware