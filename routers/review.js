const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const reviewController = require('../controllers/review.js')

router.get('/review_by/customer/:id', resourceExists('users'), reviewController.getReviewsByCustomer),
router.get('/review_to/customer/:id', resourceExists('users'), reviewController.getReviewsToCustomer),
router.get('/review_by/serviceman/:id', resourceExists('users'), reviewController.getReviewsByServicemen),
router.get('/review_to/serviceman/:id', resourceExists('users'), reviewController.getReviewsToServiceman)
router.get('/customer_rating_stats/:id', resourceExists('users'), reviewController.getCustomerRatingStats),
router.get('/serviceman_rating_stats/:id', resourceExists('users'), reviewController.getServicemanRatingStats)

module.exports = router
