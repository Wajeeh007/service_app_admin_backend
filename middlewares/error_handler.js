const returnJson = require('../custom_functions/return_json')
const {ValidationError} = require('sequelize');

const errorHandlerMiddleware = (err, req, res, next) => {

    // console.log(err)

    let errorData = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Something went wrong'
    }

    // if(err.code === 11000) {
    //     errorData.statusCode = 422,
    //     errorData.message = 'User already exists'
    // }

    // if(err.name === 'ValidationError') {

    //     errorData.statusCode = 400

    //     const keys = Object.keys(err.errors)

    //     if(keys.length > 1) {
    //         for(var item of keys) {
    //             if(item === keys[keys.length - 1]) {
    //                 errorData.message += ' and ' + item
    //             } else  if(item === keys[0]) {
    //                 errorData.message = 'Please provide ' + item
    //             } else {
    //                 errorData.message += ', ' + item
    //             }
    //         }
    //     } else {
    //         errorData.message = err.errors[keys[0]].message
    //     }
    // }

    if(err.name === 'CastError') {
        errorData.message = `No job with id: ${err.value}`;
        errorData.statusCode = 404;
    }

    return returnJson({
        res: res,
        statusCode: errorData.statusCode,
        message: errorData.message
    })
}

module.exports = errorHandlerMiddleware