const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    // if user already logged in shuold redirect to classes page
    res.render('login/login');
})

router.post("/", (req, res) => {
    //do passport stuff here
})

module.exports = router;