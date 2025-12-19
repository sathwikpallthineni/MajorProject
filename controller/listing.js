const Listing = require("../model/listingschema");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async (req,res) => {
    let listings = await Listing.find();
    let totalRating = 0;
    for(listing of listings){
        for(listing.review of listing.reviews){
            
        }
    }
    res.render("index.ejs",{listings});
}; 

module.exports.renderingListing = (req,res) => {
    res.render("new.ejs");
};

module.exports.addingListing = async(req,res,next) => {
    try{
        let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
        })
        .send();
        let url = req.file.path;
        let filename = req.file.filename;
        let listing = new Listing({
            ...req.body,
            owner:req.user._id,
        });
        listing.image = {url,filename};
        listing.geometry = response.body.features[0].geometry;
        let saved = await listing.save();
        console.log(saved);
        req.flash("success"," New Listing created");
        res.redirect("/listings");
    }catch(err) {
        next(err);
    }
    
};

module.exports.viewListing = async(req,res,next) => {
    try{
        let {id} = req.params;
        let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
        let reviews = await listing.reviews;
        let totalRating = 0;
        for(review of reviews){
            totalRating = totalRating+ review.rating;
        }
        avgRating = Number((totalRating / reviews.length).toFixed(1));
        if(!avgRating){
            avgRating = 0;
        }
        
        res.render("view.ejs",{listing,reviews,avgRating});
    }
    catch(err) {
        next(err);
    }
};

module.exports.editListing = async (req,res,next) => {
    try{    
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_300");
    res.render("edit.ejs",{listing,originalImageUrl});
    }
    catch(err){
        next(err);
    }
}

module.exports.updateListing = async (req,res,next) => {
    try{
    let {title,description,image,price,location,country} = req.body;
    const { id } = req.params;
       let listing = await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,
       });
       if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
       listing.image = {url,filename};
       await listing.save();
       }
       req.flash("success","Details Updated");
       res.redirect(`/listings`);
    }
    catch(err){
        next(err);
    }
    
};

module.exports.destroyListing = async (req,res,next) => {
    try{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
};
