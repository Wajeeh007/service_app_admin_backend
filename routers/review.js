const resourceExists = require('../middlewares/resource_exists.js')
const router = require('express').Router()
const reviewController = require('../controllers/review.js')

router.get('/review_by/customer/:id', resourceExists('users', false), reviewController.getReviewsByCustomer),
router.get('/review_to/customer/:id', resourceExists('users', false), reviewController.getReviewsToCustomer),
router.get('/review_by/serviceman/:id', resourceExists('users', false), reviewController.getReviewsByServicemen),
router.get('/review_to/serviceman/:id', resourceExists('users', false), reviewController.getReviewsToServiceman)
router.get('/customer/rating_stats/:id', resourceExists('users', false), reviewController.getCustomerRatingStats),
router.get('/serviceman/rating_stats/:id', resourceExists('users', false), reviewController.getServicemanRatingStats)

module.exports = router
