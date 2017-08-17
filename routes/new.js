const express = require('express');
const router = express.Router();
const db = require('../data');

router.get("/student", (req, res) => {
    res.render('login/student');
});

router.get("/teacher", (req, res) => {
    res.render('login/teacher');
});

router.post("/student", (req, res) => {
    //create student here
    let student = req.body;
    db.addStudent(student);
    res.redirect("/login");
});

router.post("/teacher", (req, res) => {
    //create teacher here
    let teacher = req.body;
    db.addTeacher(teacher);
    res.redirect("/login");
});

module.exports = router;