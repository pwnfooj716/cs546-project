const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
    // if user already logged in shuold redirect to classes page
    res.render('login/login');
})

router.post("/", passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),(req, res) => {
    //do passport stuff here
    res.redirect("/class");
})

module.exports = router;