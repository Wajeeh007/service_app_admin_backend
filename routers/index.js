const router = require('express').Router()

const authMiddleware = require('../middlewares/auth_middleware.js')

const zoneRouter = require('./zones.js')
const serviceRouter = require('./service.js')
const subServiceRouter = require('./sub_service.js')

router.use('/zones', zoneRouter)
router.use('/services', serviceRouter)
router.use('/sub_services', subServiceRouter),

module.exports = router