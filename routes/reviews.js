const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const campground = require('../models/campground');
const {reviewSchema} = require('../schema');
const reviewControl = require('../controllers/review');

const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')

const expressError = require('../utility/expressError');
const catchAsync = require('../utility/catchAsync');

router.post('/',isLoggedIn,validateReview, catchAsync(reviewControl.campReview));

router.delete('/:reviewid',isLoggedIn, isReviewAuthor,catchAsync(reviewControl.campDeleteReview));

module.exports = router;