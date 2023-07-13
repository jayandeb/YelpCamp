const Review = require('../models/review');
const Campground = require('../models/campground');

// create a review
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.author = req.user._id;
    review.save();
    campground.save();
    req.flash('success', 'Review Added Successfully')
    res.redirect(`/campgrounds/${campground.id}`)
}

//delete review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted Successfully')
    res.redirect(`/campgrounds/${id}`)
}