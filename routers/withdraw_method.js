const router = require('express').Router()
const withdrawMethodController = require('../controllers/withdraw_method.js')

router.get('/get', withdrawMethodController.getWithdrawMethods)
router.post('/add', withdrawMethodController.addWithdrawMethod)
router.patch('/change_status/:id', withdrawMethodController.changeWithdrawMethodStatus)
router.patch('/:id', withdrawMethodController.updateWithdrawMethod)
router.delete('/:id', withdrawMethodController.deleteWithdrawMethod)

module.exports = router