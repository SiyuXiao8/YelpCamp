const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params, since we need access to :id, and express router separate that for us
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');

// post a review, when user submit the review this route is triggered
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete a review, need to remove it from campground and the review db
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;