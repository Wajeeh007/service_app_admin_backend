const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const reviewController = require('../controllers/review.js')

router.get('/review_by/customer/:id', reviewController.getReviewsByCustomer),
router.get('/review_to/customer/:id', reviewController.getReviewsToCustomer),
router.get('/review_by/serviceman/:id', reviewController.getReviewsByServicemen),
router.get('/review_to/serviceman/:id', reviewController.getReviewsToServiceman)

module.exports = router
