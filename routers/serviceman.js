const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const servicemanController = require('../controllers/serviceman.js')

router.get('/get', servicemanController.getServicemen)
router.get('/stats', servicemanController.getServicemenStats)
// router.get('/new_requests', servicemanController.getNewServicemenRequests)
router.get('/:id', resourceExists('users'), servicemanController.getSingleServiceman),
// router.get('/get_suspended', servicemanController.getSuspendedServicemen)
// router.patch('/:id', upload.single('image'), customerController.updateCustomerDetails)
router.patch('/change_status/:id', resourceExists('users'), servicemanController.changeServicemanStatus)
router.patch('/change_suspension_status/:id', resourceExists('users'), servicemanController.changeServicemanAccountSuspension)
router.delete('/:id', resourceExists('users'), servicemanController.deleteServiceman)

module.exports = router