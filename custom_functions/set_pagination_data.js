function setPaginationData({page=undefined, limit=undefined, includePagination=true} = {}) {

    let paginationData = {}

    paginationData.page = parseInt(page, 10)
    paginationData.limit = parseInt(limit, 10)

    paginationData.includeLimits = true;

    if(!includePagination && ((paginationData.limit === undefined && paginationData.page === undefined) || (paginationData.limit === null && paginationData.page === null) || (isNaN(paginationData.limit) && isNaN(paginationData.page)))) {
        paginationData.includeLimits = false
    } else {
        if(paginationData.page === undefined || paginationData.page === null || isNaN(paginationData.page)) {
            paginationData.page = 0
        } 
        
        if(paginationData.limit === undefined || paginationData.limit === null || paginationData.limit === 0 || isNaN(paginationData.limit)) {
            paginationData.limit = 10
        }
    }

    return paginationData
}

module.exports = setPaginationData;