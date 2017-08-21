const express = require('express');
const router = express.Router();
const db = require('../data');
const bcrypt = require('bcryptjs');

router.get("/student", (req, res) => {
    res.render('login/student');
});

router.get("/teacher", (req, res) => {
    res.render('login/teacher');
});

router.post("/student", (req, res) => {
    //create student here
    let student = req.body;
    let errors = [];
    let hasError = false;
    if (!student._id) {
        hasError = true;
        errors.push("no id");
    }
    if (!student.username) {
        hasError = true;
        errors.push("no username");
    }
    if (!student.firstName) {
        hasError = true;
        errors.push("no first name");
    }
    if (!student.lastName) {
        hasError = true;
        errors.push("no last name");
    }
    if (!student.password) {
        hasError = true;
        errors.push("no password");
    }
    if (hasError) {
        res.render("login/student", {hasErrors: true, errors: errors});
        return;
    }
    student._id = Number(student._id);
    student.hashedPassword = bcrypt.hashSync(student.password, 8);
    db.checkAuth(student._id, student.username).then(() => {
        db.addStudent(student._id, student.firstName, student.lastName,
					  student.username, student.hashedPassword).then(() => res.redirect("/login"));
    }).catch((err) => {
        res.render("login/student", {hasErrors: true, errors: [err]});
    });
});

router.post("/teacher", (req, res) => {
    //create teacher here
    let teacher = req.body;
    let errors = [];
    let hasError = false;
    if (!teacher._id) {
        hasError = true;
        errors.push("no id");
    }
    if (!teacher.username) {
        hasError = true;
        errors.push("no username");
    }
    if (!teacher.firstName) {
        hasError = true;
        errors.push("no first name");
    }
    if (!teacher.lastName) {
        hasError = true;
        errors.push("no last name");
    }
    if (!teacher.password) {
        hasError = true;
        errors.push("no password");
    }
    if (hasError) {
        res.render("login/teacher", {hasErrors: true, errors: errors});
        return;
    }
    teacher._id = Number(teacher._id);
    teacher.password = bcrypt.hashSync(teacher.password,8);
    db.checkAuth(teacher._id, teacher.username).then(() => {
        db.addTeacher(teacher._id, teacher.firstName, teacher.lastName,
					  teacher.username, teacher.password).then(() => res.redirect("/login"));
    }).catch((err) => {
        res.render("login/teacher", {hasErrors: true, errors: [err]});
    });
});

module.exports = router;
