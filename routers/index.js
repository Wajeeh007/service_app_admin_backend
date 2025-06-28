const router = require('express').Router()

const authMiddleware = require('../middlewares/auth_middleware.js')

const zoneRouter = require('./zones.js')
const serviceRouter = require('./service.js')
const subServiceRouter = require('./sub_service.js')
const serviceItemRouter = require('./service_item.js')
const withdrawMethodRouter = require('./withdraw_method.js')
const customerRouter = require('./customer.js')
const servicemanRouter = require('./serviceman.js')

router.use('/zones', zoneRouter)
router.use('/services', serviceRouter)
router.use('/sub_services', subServiceRouter),
router.use('/service_items', serviceItemRouter),
router.use('/withdraw_methods', withdrawMethodRouter),
router.use('/customers', customerRouter),
router.use('/servicemen', servicemanRouter)

module.exports = router