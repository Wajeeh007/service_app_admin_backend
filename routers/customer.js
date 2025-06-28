const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const customerController = require('../controllers/customer.js')

router.get('/get', customerController.getCustomers)
router.get('/get_stats', customerController.getCustomersStats)
// router.patch('/:id', upload.single('image'), customerController.updateCustomerDetails)
router.patch('/change_status/:id', customerController.changeCustomerStatus)
router.patch('/change_suspension_status/:id', customerController.changeCustomerAccountSuspension)
router.delete('/:id', customerController.deleteCustomer)

module.exports = router