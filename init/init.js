const mongoose = require("mongoose");
const listing = require("../model/listingschema");
const init = require("./data");

mongoose.connect("mongodb://127.0.0.1:27017/PRACTICEWANDERLUST")
.then(() => {
    console.log("DataBase connected successful");
})
.catch((err) => {
    console.log(err);
})

let main = async() => {
    await listing.deleteMany({});
    init.data = init.data.map((obj) =>({...obj,owner:"6937fea3374218dd401478e5"}));
    await listing.insertMany(init.data);
}

main();