require('dotenv').config()



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const listingrouter = require("./routers/listingrouter");
const reviewrouter = require("./routers/reviewrouter");
const userrouter = require("./routers/user.js");
const ExpressError = require("./util/ExpressError");
const ejsMate = require("ejs-mate");
const Listing = require("./model/listingschema.js");
const Review = require("./model/reviewschema");
let User = require("./model/userschema");
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const{ MongoStore }= require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


app.listen(8080,(req,res) => {
    console.log("listening to server");
});


mongoose.connect(process.env.ATLASDB_URL)
// mongoose.connect("mongodb://127.0.0.1:27017/PRACTICEWANDERLUST")
.then(() => {
    console.log("DataBase connected successful");
})
.catch((err) => {
    console.log(err);
})

const store =  MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    // mongoUrl:"mongodb://127.0.0.1:27017/PRACTICEWANDERLUST",
    crypto: {
        secret: process.env.SECRET,
     },
     touchAfter: 24 * 3600,
     
  });

const sessionOptions = {
    store:store,
    secret:  process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 12*24*60*60*1000,
        maxAge:12*24*60*60*1000,
        httpOnly: true,
    }

}
app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views/listings"));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(cookieParser("secretcode"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.failure = req.flash("failure");
    res.locals.currentUser = req.user;
    res.locals.path = req.path;
    next();
});

app.use("/listings",listingrouter);
app.use("/listings/:id/review",reviewrouter);
app.use("/",userrouter);

app.use((req,res) => {
    res.status(404).send("page not found");
});

app.use((err,req,res,next) => {
    let {statuscode=500,message = "something went wrong"} = err;
    res.render("error.ejs",{message});
});