const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review); // add this new review just made onto the review array in campground
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campgrounds/${req.params.id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // delete it from campground db, using pull
    await Review.findByIdAndDelete(reviewId); // delete from review db
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`)
};