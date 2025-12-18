const mongoose = require("mongoose");
const LocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    // email: {
    //     type:String,
    //     required:true,
    // },
});

UserSchema.plugin(LocalMongoose);

module.exports = mongoose.model("User",UserSchema);
