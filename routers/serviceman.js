const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const servicemanController = require('../controllers/serviceman.js')

router.get('/get', servicemanController.getServicemen)
router.get('/get_stats', servicemanController.getServicemenStats)
router.get('/get_new_requests', servicemanController.getNewServicemenRequests)
// router.patch('/:id', upload.single('image'), customerController.updateCustomerDetails)
router.patch('/change_status/:id', servicemanController.changeServicemanStatus)
router.patch('/change_suspension_status/:id', servicemanController.changeServicemanAccountSuspension)
router.delete('/:id', servicemanController.deleteServiceman)

module.exports = router