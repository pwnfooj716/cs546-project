const express = require('express');
const router = express.Router();
const db = require('../data');

const multer = require('multer');
const upload = multer({dest: "file_uploads/"});

router.get("/", (req, res) => {
    //get data to add to class list here
    let user = req.user;
    if (!user) {
        res.redirect('/login');
        return;
    }
    if (user.isStudent) {
        db.getCoursesForStudent(user._id).then((courses) => {
            res.render('class/classList', {classes: courses});
        });
    } else {
        db.getCoursesForTeacher(user._id).then((courses) => {
            let data = {
                classes: courses,
                isTeacher: true
            }
            res.render('class/classList', data);
        });
    }
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

router.get("/student", (req,res) => {
   //checks if student exists
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    if (!req.query.student)
    {
        res.json({isStudent: false});
        return;
    }
    db.getStudents([req.query.student]).then((result) => {
        if (result.length > 0)
            res.json({isStudent: true});
        else
            res.json({isStudent: false});
    });
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
                        assignmentName: assignments[x].assignmentName,
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
                            for (let y = 0; y < starr.length; y++) {
                                if (starr[y]._id === s.studentId){
                                    starr[y].assignments.push(s.grade);
                                }
                            }
                        });
                        assign.push({
                            id: x,
                            name: assignments[x].assignmentName
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
    let students = req.body.ids;
    db.createCourseForTeacher(user._id, name, students).then(()=> res.redirect("/class"));

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
    let student = (user.isStudent)? user._id: req.query.student;
    if (!student) {
        res.sendStatus(403);
        return;
    }
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length < assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        let assignment = assignments[assignmentID];
        let submission = assignment.submissions.find((x) => {return x.studentId === student});
        let data = {
            class: {id: classID},
            assignment: {id: assignmentID, name: assignment.name, description: assignment.prompt, dueDate: assignment.dueDate},
            student: student
        };
        if (user.isTeacher) {
            data.submission = submission;
            data.submission.grade = (isNaN(data.submission.grade))? 0: data.submission.grade;
            data.isTeacher = true;
        }
        if (user.isStudent && submission)
            data.submission = submission.submission.originalname;
        res.render('class/assign', data);
    });
});

router.get("/:classID/:assignmentID/:studentID", (req, res) => {
    //download a student's submission here
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    let studentID = req.params.studentID;
    
    //authenticate to make sure user has permission to access file
    if ((user.isStudent) && (user._id !== studentID)) {
        res.sendStatus(403);
        return;
    }

    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.getAssignmentSubmission(assignments[assignmentID]._id, studentID).then((submission) => {
            res.download("file_uploads/" + submission.filename, submission.originalname);
        });
    });
});

router.post("/:classID", (req, res) => {
    //create an assignment here
    let user = req.user;
    if (!user || !user.isTeacher) {
        res.redirect("/login");
        return;
    }
    let data = req.body;
    let courseID = user.courses[req.params.classID].courseId;
    db.createAssignmentForCourse(courseID, data.name, data.prompt,
                                 data.dueDate).then(() => res.redirect(`/class/${req.params.classID}`));
});

router.post("/:classID/:assignmentID", upload.single("submission"), (req, res) => {
   //post a submission here
    let user = req.user;
    if (!user || !user.isStudent) {
        res.redirect("/login");
        return;
    }
    
    let submission = {
        originalname: req.file.originalname,
        filename: req.file.filename
    };
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.user._id, assignments[assignmentID]._id, submission).then(() => {
            res.redirect(`/${classID}/${assignmentID}`);
        });
    });
});

router.put("/:classID/:assignmentID", upload.single("submission"), (req, res) => {
    //update a submission here
    let user = req.user;
    if (!user || !user.isStudent) {
        res.redirect("/login");
        return;
    }
    let submission = {
        originalname: req.file.originalname,
        filename: req.file.filename
    };
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length <= assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.user._id, assignments[assignmentID]._id, submission).then(() => {
            res.redirect(`/${classID}/${assignmentID}`);
        });
    });
});

router.put("/:classID/:assignmentID/:studentID/grade", (req, res) => {
    //update grade here
    let user = req.user;
    if (!user || !user.isTeacher) {
        res.redirect("/login");
        return;
    }
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    let studentID = req.params.studentID;
    let grade = Number(req.body.grade);
    if (isNaN(grade)) {
        res.json({error: "grade not a number"});
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length <= assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentGrade(studentID,assignments[assignmentID]._id,grade).catch((err) => {
            res.json({error: err});
        })
    });
});

router.put("/:classID/:assignmentID/:studentID/comment", (req, res) => {
    //update comment here
    let user = req.user;
    if (!user || !user.isTeacher) {
        res.redirect("/login");
        return;
    }
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    let studentID = req.params.studentID;
    let comment = req.body.comment;
    if (!comment) {
        res.json({error: "no comment given"});
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length <= assignmentID) {
            res.redirect(`/${classID}`);
            return;
        }
        db.updateAssignmentGrade(studentID,assignments[assignmentID]._id,undefined,comment).catch((err) => {
            res.json({error: err});
        })
    });
});

module.exports = router;
