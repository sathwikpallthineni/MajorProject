const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {loggedIn} = require("../util/loggedin");
let User = require("../model/userschema");
const passport = require("passport");
const userController = require("../controller/user");


router.route("/signup")
.get(userController.renderingSignup)
.post(userController.signup)

router.route("/login")
.get(userController.renderingLogin)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,keepSessionInfo: true}),userController.login);

router.get("/logout",userController.logout);
module.exports = router;

