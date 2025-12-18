const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {loggedIn,OwnerIn} = require("../util/loggedin");
const Listing = require("../model/listingschema");
const Review = require("../model/reviewschema");
const listingController = require("../controller/listing");
const multer = require("multer");
const {storage} = require("../cloudinaryconfig");
const upload = multer({storage});

router.route("/")
    .get(listingController.index)
    .post(loggedIn,upload.single("image"),listingController.addingListing)
   

router.get("/new",loggedIn,listingController.renderingListing);

router.route("/:id")
.get(listingController.viewListing)
.put(loggedIn,OwnerIn,upload.single("image"),listingController.updateListing)
.delete(loggedIn,OwnerIn,listingController.destroyListing)

router.get("/edit/:id",loggedIn,OwnerIn,listingController.editListing);

router.post("/search",async(req,res) => {
    let {input} = req.body;
    let listing = await Listing.find();
    for(list of listing){
        if(list.title == input || list.title.toLowerCase() == input || list.title.toUpperCase() == input) {
           let result = list;
           console.log(result);
           console.log(list.title.toLowerCase());
         return res.render("search.ejs",{result})
        }
    }
    req.flash("error","No match found");
    res.redirect("/listings");
})
module.exports = router;