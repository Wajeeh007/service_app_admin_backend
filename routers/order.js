const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const orderController = require('../controllers/order.js')

router.get('/get', orderController.getOrders)
router.get('/stats', orderController.getOrdersStats)
router.get('/:id', resourceExists('users', false), orderController.getSingleUserOrders)

module.exports = router