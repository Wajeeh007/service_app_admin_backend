const authController = require('../controllers/auth.js')
const router = require('express').Router()
const authMiddleware = require('../middlewares/auth_middleware.js')

router.get('/user_profile', authMiddleware, authController.getUserData)
router.post('/login', authController.login)
// router.post('/forgot_password', authController.forgotPassword)

module.exports = router;