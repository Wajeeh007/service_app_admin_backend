const router = require('express').Router()
const withdrawRequestController = require('../controllers/withdraw_request.js')

router.get('/get', withdrawRequestController.getWithdrawRequests)

module.exports = router