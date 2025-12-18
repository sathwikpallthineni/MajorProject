const mongoose = require("mongoose");
const reviewschema = new mongoose.Schema({
    review: {
        type:String,
    },
    rating:{
        type:Number,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});


const Review = mongoose.model("Review",reviewschema);

module.exports = Review;