const zoneController = require('../controllers/zones.js')
const resourceExists = require('../middlewares/resource_exists.js')

const router = require('express').Router();

router.post('/add', zoneController.addZone)
router.get('/get', zoneController.getZones)
router.patch('/:id', resourceExists('zones'), zoneController.updateZone),
router.delete('/:id', resourceExists('zones'), zoneController.deleteZone)
router.patch('/change_status/:id', resourceExists('zones'), zoneController.changeZoneStatus)

module.exports = router