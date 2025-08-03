const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const customerController = require('../controllers/customer.js')

router.get('/get', customerController.getCustomers)
router.get('/stats', customerController.getCustomersStats)
router.get('/:id', resourceExists('users'), customerController.getSingleCustomer),
router.get('/activity/:id', resourceExists('users', false), customerController.getCustomerActivity)
// router.patch('/:id', upload.single('image'), customerController.updateCustomerDetails)
router.patch('/change_status/:id', resourceExists('users'), customerController.changeCustomerStatus)
// router.patch('/change_suspension_status/:id', resourceExists('users'), customerController.changeCustomerAccountSuspension)
router.delete('/:id', resourceExists('users'), customerController.deleteCustomer)

module.exports = router