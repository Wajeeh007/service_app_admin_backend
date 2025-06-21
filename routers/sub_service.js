const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const subServiceController = require('../controllers/sub_service.js')

router.get('/get', subServiceController.getSubServices)
router.post('/add', upload.single('image'), subServiceController.addSubService)
router.patch('/:id', upload.single('image'), subServiceController.updateSubService)
router.patch('/change_status/:id', subServiceController.changeSubServiceStatus)
router.delete('/:id', subServiceController.deleteSubService)

module.exports = router