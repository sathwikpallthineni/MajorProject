const Listing = require("../model/listingschema");
const Review = require("../model/reviewschema");

module.exports.loggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.session.listingId = req.params.id;
        req.flash("error","must be logged in");
       return res.redirect("/login");
    }
    next();
}

module.exports.OwnerIn = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!req.user) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.reviewOwner = async (req, res, next) => {
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!req.user){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error","You're not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
