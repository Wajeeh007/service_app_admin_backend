function setBodyValues(body) {

    let detailsVariable = {}

    for(var i = 0; i < Object.keys(body).length; i++) {
        detailsVariable[Object.keys(body)[i]] = Object.values(body)[i]
    }

    return detailsVariable
}

module.exports = setBodyValues