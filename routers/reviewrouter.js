const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const Listing = require("../model/listingschema");
const Review = require("../model/reviewschema");
const {loggedIn,OwnerIn,reviewOwner} = require("../util/loggedin");
const reviewController = require("../controller/reviews");

router.post("/",loggedIn,reviewController.addingRreview);
router.delete("/:reviewid",loggedIn,reviewOwner,reviewController.destroyReview);
module.exports = router;