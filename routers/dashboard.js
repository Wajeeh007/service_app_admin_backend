const dashboardController = require('../controllers/dashboard.js')
const router = require('express').Router()

router.get('/user_stats', dashboardController.getUserStats)
router.get('/zone_stats', dashboardController.getZoneWiseTimePeriodStats)

module.exports = router