const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const orderController = require('../controllers/order.js')

router.get('/get', orderController.getOrders)
router.get('/stats', orderController.getOrdersStats)

module.exports = router