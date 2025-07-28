const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const subServiceController = require('../controllers/sub_service.js')

router.get('/get', subServiceController.getSubServices)
router.post('/add', upload.single('image'), subServiceController.addSubService)
router.patch('/:id', upload.single('image'), resourceExists('sub_service'), subServiceController.updateSubService)
router.patch('/change_status/:id', resourceExists('sub_service'), subServiceController.changeSubServiceStatus)
router.delete('/:id', resourceExists('sub_service'), subServiceController.deleteSubService)

module.exports = router