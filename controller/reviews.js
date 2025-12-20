const Listing = require("../model/listingschema");
const Review = require("../model/reviewschema");

module.exports.addingRreview = async (req,res) => {
    try{
    let {id} = req.params;
    console.log(req.body,req.body.rating);
    let {rating,review} = req.body;
    let random = await Review.insertOne({
        review:review,
        rating:rating,
        author:req.user._id,
    });
    let listing = await Listing.findById(id).populate("reviews");
    listing.reviews.push(random);
    await listing.save();

    let totalRating = 0;
    for(listing.review of listing.reviews){
        totalRating = totalRating+listing.review.rating;
    }
    let avgRating = Number((totalRating /listing.reviews.length).toFixed(1));
    listing.avgRating = avgRating;
    let result = await listing.save();
    console.log(result);
    req.flash("success","Review created");
    res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
}

module.exports.destroyReview = async(req,res) => {
    try{
    let {id,reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
}