const dashboardController = require('../controllers/dashboard.js')
const router = require('express').Router()

router.get('/user_stats', dashboardController.getUserStats)
router.get('/zone_stats', dashboardController.getZoneWiseTimePeriodStats)
router.get('/admin_earnings', dashboardController.getAdminEarningStats)

module.exports = router