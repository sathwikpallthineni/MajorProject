const mongoose = require("mongoose");
const Review = require("./reviewschema");

const listingschema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String,
        required:true,
    },
    image: {
        url: String,
        filename: String,
    },
    price:  {
        type: Number,
        required:true,
    },
    location:  {
        type: String,
        required:true,
    },
    country:  {
        type: String,
        required:true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    //   required: true
    },
    coordinates: {
      type: [Number],
    //   required: true
    }
  },
});

listingschema.post("findOneAndDelete",(listing) => {
    Review.deleteMany({_id : {$in: listing.reviews}});


});
const listing = mongoose.model("listing",listingschema);
module.exports = listing;