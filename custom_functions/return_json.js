// const encryptDataFunc = require('./encrypt_data.js')

function returnJson({res=res, statusCode=200, message=undefined, data=undefined, page=undefined, limit=undefined, encryptData = false} = {}) {

    let json = {
        success: statusCode >= 200 && statusCode <= 299,
    }

    if(message) {
        json.message = message
    }

    if(!isNaN(page)) {
        json.page = page
    }

    if(limit) {
        json.limit = limit
    }

    if(data) {
        json.data = data
    }

    // if(encryptData) {

    //     json.data = encryptDataFunc(data)
    //     return res.status(statusCode).json(json).end()
    // }

    return res.status(statusCode).json(json).end()

}

module.exports = returnJson