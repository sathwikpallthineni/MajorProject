let User = require("../model/userschema");
const passport = require("passport");

module.exports.renderingSignup = (req,res) => {
    res.render("signup.ejs");
}
module.exports.signup = async(req,res,next) => {
    let {username,password,email} = req.body;
    let user = new User({
        username:username,
    });
    let registeredUser = await User.register(user,password);
    req.login(registeredUser,(err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    });
}

module.exports.renderingLogin = (req,res) => {
    res.render("login.ejs");
}

module.exports.login = (req,res) => {
    req.flash("success","welcome back to wanderlust!");
    if(req.session.redirectUrl){
        if(req.session.redirectUrl == `/listings/${req.session.listingId}/review`){
            return res.redirect(`/listings/${req.session.listingId}`);
        }
        return res.redirect(req.session.redirectUrl);
    }
    res.redirect("/listings");
}

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/login");
    })
}