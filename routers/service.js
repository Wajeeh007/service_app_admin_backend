const limitterMiddleware = require('../middlewares/set_limit_and_page.js')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = require('express').Router()
const serviceController = require('../controllers/service.js')

router.get('/get', serviceController.getServices)
router.post('/add', upload.single('image'), serviceController.addNewService)
router.patch('/:id', upload.single('image'), serviceController.updateService)
router.patch('/change_status/:id', serviceController.changeServiceStatus)
router.delete('/:id', serviceController.deleteService)

module.exports = router