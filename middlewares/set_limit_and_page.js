const limitAndPageMiddleware = (req, res, next) => {
    let page = parseInt(req.query.page, 10)
    let limit = parseInt(req.query.limit, 10)

    if(page === undefined || page === null || isNaN(page)) {
        req.body.page = 0
    } 
    
    if(limit === undefined || limit === null || limit === 0 || isNaN(limit)) {
        req.body.limit = 20
    }

    next()
}

module.exports = limitAndPageMiddleware