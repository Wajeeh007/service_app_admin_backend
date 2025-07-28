const limitterMiddleware = require('../middlewares/set_limit_and_page.js')
const resourceExists = require('../middlewares/resource_exists.js')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const serviceController = require('../controllers/service.js')

router.get('/get', serviceController.getServices)
router.post('/add', upload.single('image'), serviceController.addNewService)
router.patch('/:id', upload.single('image'), resourceExists('service'), serviceController.updateService)
router.patch('/change_status/:id', resourceExists('service'), serviceController.changeServiceStatus)
router.delete('/:id', resourceExists('service'), serviceController.deleteService)

module.exports = router