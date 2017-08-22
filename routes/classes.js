const express = require('express');
const router = express.Router();
const db = require('../data');

router.get("/", (req, res) => {
    //get data to add to class list here
    let user = req.user;
    if (!user) {
        res.redirect('/login');
        return;
    }
    if (user.isStudent)
        db.getCoursesForStudent(user._id).then((courses) => {

            res.render('class/classList', {classes: courses});
        });
    else
        db.getCoursesForTeacher(user._id).then((courses) => {
        let data ={
            classes: courses,
            isTeacher: true
        }
            res.render('class/classList', data);
        });
});

router.get("/new", (req,res) => {
    //class creation page
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    res.render('class/createClass');
});

router.get("/:classID", (req, res) => {
    //get class info based on class ID
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let courseID = user.courses[req.params.classID].courseId;
    db.getAssignmentsForCourse(courseID).then((assignments) => {
        let data = {};
        let assign = [];
        db.getCourse(courseID).then((course) => {
            data.class = {id: req.params.classID, name: course.courseName};
            if (user.isStudent) {
                for (let x = 0; x < assignments.length; x++) {
                    let sub = assignments[x].submissions;
                    let submission = {grade: "NA"};
                    if (sub.length)
                        submission = sub.find((s) => {
                        return s.studentID === user.id
                    });
                    assign.push({
                        id: x,
                        name: assignments[x].name,
                        grade: submission.grade,
                        dueDate: assignments[x].dueDate
                    });
                }
                data.isStudent = true;
                data.assignments = assign;
                res.render("class/class", data);
            } else {
                db.getStudents(course.studentIDs).then((students) => {
                    let starr = students.map((s) => {
                        return {_id: s._id, name: `${s.firstName} ${s.lastName}`, assignments: []}
                    });
                    for (let x = 0; x < assignments.length; x++) {
                        let sub = assignments[x].submissions;
                        sub.forEach((s) => {
                            for (let y= 0;y<starr.length; y++) {
                                if (starr[x]._id === s.studentID){
                                    starr[x].assignments.push(s.grade);
                                }
                            }
                        });
                        assign.push({
                            id: x,
                            name: assignments[x].name
                        });
                    }
                    data.isStudent = false;
                    data.assignments = assign;
                    data.students = starr;
                    res.render("class/class", data);
                });
            }
        });
    });
});

router.post("/", (req,res) => {
    //add class based on json data
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    let name = req.body.name;
    let students = req.body.ids.map((x) => Number(x));
    db.createCourseForTeacher(user._id,name,students).then(()=> res.redirect("/class"));

});

router.get("/:classID/new", (req, res) => {
    //assignment creation page
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    let data = {classId: req.params.classID};
    res.render('class/createAssign', data);
});

router.get("/:classID/:assignmentID", (req,res) => {
    //display the assignment the user wants to see
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length< assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        let assignment = assignments[assignmentID];
        let data = {
            class: {id: classID},
            assignment: {id: assignmentID, name: assignment.name, description: assignment.prompt, dueDate: assignment.dueDate}
        };
        res.render('class/assign', data);
    });
});

router.post("/:classID", (req, res) => {
    //create an assignment here
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    let data = req.body;
    let courseID = user.courses[req.params.classID].courseId;
    db.createAssignmentForCourse(courseID,data).then(() => res.redirect(`/class/${req.params.classID}`));
});

router.post("/:classID/:assignmentID", (req, res) => {
   //post a submission here
    let user = req.user;
    if (!user && !user.isStudent) {
        res.redirect("/login");
        return;
    }
    let data = req.body.submission;
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID]).then((assignments)=> {
        if (assignments.length < assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.body.studentId, assignments[assignmentID]._id, data).then(() => {
            res.redirect(`/${classID}/${assignmentID}`);
        });
    });
});

router.put("/:classID/:assignmentID", (req, res) => {
    //update a submission here
    let user = req.user;
    if (!user && !user.isStudent) {
        res.redirect("/login");
        return;
    }
    let data = req.body.submission;
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID]).then((assignments)=> {
        if (assignments.length < assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.body.studentId, assignments[assignmentID]._id, data).then(() => {
            res.redirect(`/${classID}/${assignmentID}`);
        });
    });
});

module.exports = router;
