const errors = require('../errors/index.js')
const customer = require('../models/customer.js')

const customerExists = async (req, res, next) => {
  
  const user = await customer.findByPk(req.tokenData.id)
  if(user === undefined || user === null) {
    return next(new errors.NotFoundError('No user found'))
  } 
        
  if(user['account_deleted'] === 1) {
      return next(new errors.UnauthenticatedError('This user account has been deleted'))
  }

  if(user['is_suspended'] === 1) {
      return next(new errors.UnauthenticatedError('This user account has been suspended'))
  }
  
  next()
}  

module.exports = customerExists