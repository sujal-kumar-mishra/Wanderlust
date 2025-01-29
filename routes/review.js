const express = require('express');
const router = express.Router({mergeParams : true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../views/middleware.js');
const reviewController = require('../controllers/reviews.js'); 
const wrapAsync = require('../utils/wrapAsync.js');

//Reviews
//post route
router.post("/" ,isLoggedIn,validateReview,wrapAsync(reviewController.newReview));

//Delete route for review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;