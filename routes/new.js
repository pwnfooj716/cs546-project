const express = require('express');
const router = express.Router();

router.get("/student", (req, res) => {
    res.render('login/student');
});

router.get("/teacher", (req, res) => {
    res.render('login/teacher');
});

router.post("/student", (req, res) => {
    //create student here
});

router.post("/teacher", (req, res) => {
    //create teacher here
});

module.exports = router;