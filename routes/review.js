const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/loginMiddleware')
const CatchAsync = require('../utitlities/CatchAsync')

const reviewController = require('../controller/reviewController');


// review  

// 1.POST REVIEW

router.post('/', isLoggedIn, validateReview, CatchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, CatchAsync(reviewController.deleteReview))


module.exports = router;