const Review = require('../models/review');
const campground = require('../models/campground');

module.exports.campReview = async (req, res)=> {
    const campgroundr = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campgroundr.reviews.push(review);
    await review.save();
    await campgroundr.save();
    req.flash('success','Thanks for Review us')
    res.redirect(`/campgrounds/${campgroundr._id}`)
}

module.exports.campDeleteReview = async(req, res)=>{
    const {id,reviewid} = req.params;
    await campground.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success','Successfully review delete')
    res.redirect(`/campgrounds/${id}`);
}