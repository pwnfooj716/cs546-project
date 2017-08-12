const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    //get data to add to class list here
    res.render('class/classList');
});

router.get("/:classID", (req, res) => {
    //get class info based on class ID
    res.render('class/class');
});

router.post("/", (req,res) => {
    //add class based on json data
});

router.get("/:classID/:assignmentID", (req,res) => {
    //display the assignment the user wants to see
    res.render('class/assignment');
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