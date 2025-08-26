const router = require('express').Router()

const authMiddleware = require('../middlewares/auth_middleware.js')

const zoneRouter = require('./zones.js')
const serviceRouter = require('./service.js')
const subServiceRouter = require('./sub_service.js')
const serviceItemRouter = require('./service_item.js')
const withdrawMethodRouter = require('./withdraw_method.js')
const customerRouter = require('./customer.js')
const servicemanRouter = require('./serviceman.js')
const withdrawRequestRouter = require('./withdraw_request.js')
const orderRouter = require('./order.js')
const reviewRouter = require('./review.js')
const dashboardRouter = require('./dashboard.js')
const authRouter = require('./auth.js')

router.use('/zones', authMiddleware, zoneRouter)
router.use('/services', authMiddleware, serviceRouter)
router.use('/sub_services', authMiddleware, subServiceRouter),
router.use('/service_items', authMiddleware, serviceItemRouter),
router.use('/withdraw/methods', authMiddleware, withdrawMethodRouter),
router.use('/customers', authMiddleware, customerRouter),
router.use('/servicemen', authMiddleware, servicemanRouter)
router.use('/withdraw/requests', authMiddleware, withdrawRequestRouter)
router.use('/orders', authMiddleware, orderRouter)
router.use('/reviews', authMiddleware, reviewRouter)
router.use('/dashboard', authMiddleware, dashboardRouter)
router.use('/auth', authRouter)

module.exports = router