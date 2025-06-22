const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const serviceItemController = require('../controllers/service_item.js')

router.get('/get', serviceItemController.getServiceItems)
router.post('/add', upload.single('image'), serviceItemController.addServiceItem)
router.patch('/:id', upload.single('image'), serviceItemController.updateServiceItem)
router.patch('/change_status/:id', serviceItemController.changeServiceItemStatus)
router.delete('/:id', serviceItemController.deleteServiceItem)

module.exports = router