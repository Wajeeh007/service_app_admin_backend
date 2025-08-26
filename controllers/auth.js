const errors = require('../errors/index.js')
const returnJson = require('../custom_functions/return_json.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models')
const emailValidator = require('../utils/validators/email_validator.js')
require('dotenv').config()
const {superAdminRole, adminRole} = require('../utils/role_names.js')

/// API to log user in.
const login = async (req, res, next) => {
    if(req.body.email === undefined || req.body.email === null || !emailValidator(req.body.email.toString().toLowerCase().trim())) {
        return next(new errors.BadRequestError('Invalid email provided'))
    }    

    if(req.body.password === undefined || req.body.password === null) {
        return next(new errors.BadRequestError('Invalid password provided'))
    }

    try {
        const user = await User.findOne({
            where: {email: req.body.email},
            attributes: {exclude: ['updated_at']},
            include: [{
                association: 'admin_profile',
                attributes: ['last_login', 'role_id', ['id', 'admin_profile_id']],
                required: true,
            }]
        })

        if(user === undefined || user === null || user['status'] != 'active') {
            return next(new errors.UnauthenticatedError())
        }

        const isPasswordSame = await comparePassword({receivedPassword: req.body.password, encryptedPassword: user['password_hash']})
        if(isPasswordSame) {
            const token = await createJWT({id: user['id']})
            let result = {
                ...user.toJSON(),
                ...user['admin_profile'].toJSON(),
                admin_profile: undefined,
            }

            delete result.password_hash

            return returnJson({
                res: res,
                statusCode: 200,
                message: 'Successfully logged in',
                data: {
                    user: result,
                    token: token
                }
            })
        } else {
            return next(new errors.UnauthenticatedError('Invalid credentials'))
        }
    } catch (e) {

        return next(new errors.InternalServerError())
    }
}

/// API to fetch data of a user. Token is decrypted and through the ID we fetch the user
const getUserData = async (req, res, next) => {

    try {
        const user = await User.findByPk(req.tokenData.id, {
            attributes: {exclude: ['updated_at', 'password_hash']},
            include: [{
                association: 'admin_profile',
                required: true,
                attributes: [['id', 'admin_profile_id'], 'role_id', 'last_login'],
                include: [{
                    association: 'roles',                        
                    attributes: ['id', 'name']
                }]
            }]
        })

        if(user === undefined || user === null || (user['status'] != 'active' && (user['roles']['name'] != superAdminRole || user['roles']['name'] != adminRole))) {
            return next(new errors.UnauthenticatedError())
        }

        return returnJson({
            res: res,
            statusCode: 200,
            message: 'Fetched admin profile data',
            data: {
                ...user.toJSON(),
                ...user['admin_profile'].toJSON(),
                admin_profile: undefined,
            }
        })
    } catch(e) {
        return next(new errors.InternalServerError())
    }

}

/// Encrypt the given password to be stored in the database.
async function encryptPassword(password, next) {
    try {
        let encryptedPassword = await bcrypt.hash(password, process.env.HASH_SALT || 10)
        return encryptedPassword
    } catch(e) {
        return next(new errors.InternalServerError())
    }
}

/// Create JWT Token with the given Customer ID and Email.
function createJWT({id = ''} = {}, next) {
    try {
        return jwt.sign({id: id,},
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        })       
    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

/// Function to compare hashed password with the provided password.
async function comparePassword({receivedPassword = '', encryptedPassword = ''} = {}, next) {
    try {
        const isMatch = await bcrypt.compare(receivedPassword, encryptedPassword)
        return isMatch
    } catch (e) {
        return next(new errors.InternalServerError())
    }
}

module.exports = {
    login,
    getUserData,
}