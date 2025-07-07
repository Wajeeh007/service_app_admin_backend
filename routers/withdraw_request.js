const router = require('express').Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const withdrawRequestController = require('../controllers/withdraw_request.js')

router.get('/get', withdrawRequestController.getWithdrawRequests)
router.patch('/:id', upload.single('receipt'), withdrawRequestController.changeWithdrawRequestStatus)

module.exports = router