const express = require('express');
const router = express.Router();
const db = require('./data');

router.get("/", (req, res) => {
    //get data to add to class list here
    let studentId = 10000000; //cookie should already know this
    db.getCoursesForStudent(studentId).then((courses) => {
        res.render('class/classList', courses);
    });
    let data ={
        classes: [{
            id: 1,
            name: "cs546",
            semester: "summer"
        },{
            id: 2,
            name: "cs546",
            semester: "fall"
        }]
    };
    res.render('class/classList',data);
});

router.get("/:classID", (req, res) => {
    //get class info based on class ID
    let data = {
        isStudent: true,
        class: {id: req.params.classID, name: "cs546"},
        assignments: [{
            id: 1,
            name: "first",
            deadline: "1/1/1",
            grade: "NA"
        },{
            id: 2,
            name: "second",
            deadline: "1/1/1",
            grade: "NA"
        }]
    };
    let tdata = {
        isStudent: false,
        class: {id: req.params.classID, name: "cs546"},
        assignments: [{
            id: 1,
            name: "first",
            deadline: "1/1/1",
            grade: "NA"
        },{
            id: 2,
            name: "second",
            deadline: "1/1/1",
            grade: "NA"
        }],
        students: [{
            name: "john",
            assignments: [99,100]
        },{
            name: "bob",
            assignments: [100,99]
        }]
    }

    if (req.params.classID == 1)
        res.render('class/class', data);
    else
        res.render('class/class', tdata);
});

router.post("/", (req,res) => {
    //add class based on json data
});

router.get("/:classID/:assignmentID", (req,res) => {
    //display the assignment the user wants to see
    let data = {
        class: {id: req.params.classID},
        assignment: {id: req.params.assignmentID, name: "first", description: "This is an assignment"}
    };
    res.render('class/assign', data);
});

router.post("/:classId"), (req, res) => {
    //create an assignment here
};

router.post("/:classID/:assignmentID", (req, res) => {
   //post a submission here
});

router.put("/:classID/:assignmentID", (req, res) => {
    //update a submission here
});

module.exports = router;