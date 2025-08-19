const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const serviceItemController = require('../controllers/service_item.js')

router.get('/get', serviceItemController.getServiceItems)
router.post('/add', upload.single('image'), serviceItemController.addServiceItem)
router.patch('/:id', upload.single('image'), resourceExists('service_item'), serviceItemController.updateServiceItem)
router.patch('/change_status/:id', resourceExists('service_item'), serviceItemController.changeServiceItemStatus)
router.delete('/:id', resourceExists('service_item'), serviceItemController.deleteServiceItem)

module.exports = router