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
    if (!user.courses[req.params.classID]) {
        res.redirect("/class");
        return;
    }
    let courseID = user.courses[req.params.classID].courseId;

    db.getAssignmentsForCourse(courseID).then((assignments) => {
        let data = {};
        let assign = [];
        db.getCourse(courseID).then((course) => {
            data.class = {id: req.params.classID, name: course.courseName};
            data.announcements = course.announcements;
            if (user.isStudent) {
                for (let x = 0; x < assignments.length; x++) {
                    let sub = assignments[x].submissions;
                    let submission = {grade: "NA"};
                    if (sub.length)
                        submission = sub.find((s) => {
                        return s.studentID === user.id
                    });
                    let grade = (isNaN(submission.grade))? "NA": submission.grade;
                    assign.push({
                        id: x,
                        assignmentName: assignments[x].assignmentName,
                        grade: grade,
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
                                    let grade = (isNaN(s.grade))? "NA": s.grade;
                                    starr[y].assignments.push(grade);
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

router.delete("/:classID", (req, res) => {
   //class deletion
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    if (!user.courses[req.params.classID]) {
        res.redirect("/login");
        return;
    }
    db.deleteCourse(user.courses[req.params.classID].courseId).then(() => {
        res.redirect("/class");
    });
});

router.get("/:classID/assignment", (req, res) => {
    //assignment creation page
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    if (!user.courses[req.params.classID]) {
        res.redirect("/class");
        return;
    }
    let data = {classId: req.params.classID};
    res.render('class/createAssign', data);
});
router.get("/:classID/announcement", (req, res) => {
    //announcement creation page
    let user = req.user;
    if (!user || user.isStudent) {
        res.redirect("/login");
        return;
    }
    if (!user.courses[req.params.classID]) {
        res.redirect("/class");
        return;
    }
    let data = {classId: req.params.classID};
    res.render('class/createAnnounce', data);
});
router.get("/:classID/:assignmentID", (req,res) => {
    //display the assignment the user wants to see
    let user = req.user;
    if (!user) {
        res.redirect("/login");
        return;
    }
    let student = (user.isStudent) ? user._id : req.query.student;
    if (!student) {
        res.sendStatus(403);
        return;
    }
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    if (!user.courses[classID]) {
        res.redirect("/class");
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        let assignment = assignments[assignmentID];
        let submission = assignment.submissions.find((x) => {return x.studentId === student});
        let data = {
            class: {id: classID},
            assignment: {id: assignmentID, name: assignment.assignmentName, description: assignment.prompt, dueDate: assignment.dueDate},
            student: student
        };
        if (submission) {
            data.submission = submission;
        }
        if (user.isTeacher) {
            data.submission.grade = (isNaN(data.submission.grade)) ? 0 : data.submission.grade;
            data.isTeacher = true;
        }
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
    if (!user.courses[classID]) {
        res.redirect("/class");
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        db.getAssignmentSubmission(assignments[assignmentID]._id, studentID).then((submission) => {
            res.download("file_uploads/" + submission.filename, submission.originalname);
        });
    });
});

router.post("/:classID/assignment", (req, res) => {
    //create an assignment here
    let user = req.user;
    if (!user || !user.isTeacher) {
        res.redirect("/login");
        return;
    }
    let data = req.body;
    let courseID = user.courses[req.params.classID].courseId;
    if (!courseID) {
        return;
    }
    db.createAssignmentForCourse(courseID, data.name, data.prompt,
                                 data.dueDate).then(() => res.redirect(`/class/${req.params.classID}`));
});

router.post("/:classID/announcement", (req, res) => {
    //create an annoucement here
    let user = req.user;
    if (!user || !user.isTeacher) {
        res.redirect("/login");
        return;
    }
    if (!user.courses[req.params.classID]) {
        res.redirect("/class");
        return;
    }
    let data = req.body;
    let courseID = user.courses[req.params.classID].courseId;
    if (!courseID) {
        return;
    }
    db.createAnnouncementForCourse(courseID, data.name, data.prompt).then(() => {
        res.redirect(`/class/${req.params.classID}`);
    });
});

router.post("/:classID/:assignmentID", upload.single("submission"), (req, res) => {
   //post a submission here
    let user = req.user;
    if (!user || !user.isStudent) {
        res.redirect("/login");
        return;
    }
    if (!req.file) {
        res.redirect(`/class/${req.params.classID}/${req.params.assignmentID}`)
        return;
    }
    let submission = {
        originalname: req.file.originalname,
        filename: req.file.filename
    };
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    if (!user.courses[classID]) {
        res.redirect("/class");
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.user._id, assignments[assignmentID]._id, submission).then(() => {
            res.redirect(`/class/${classID}/${assignmentID}`);
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
    if (!req.file) {
        res.redirect(`/class/${req.params.classID}/${req.params.assignmentID}`)
        return;
    }
    let submission = {
        originalname: req.file.originalname,
        filename: req.file.filename
    };
    let classID = req.params.classID;
    let assignmentID = req.params.assignmentID;
    if (!user.courses[classID]) {
        res.redirect("/class");
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments)=> {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        db.updateAssignmentSubmission(req.user._id, assignments[assignmentID]._id, submission).then(() => {
            res.redirect(`/class/${classID}/${assignmentID}`);
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
    if (!user.courses[classID]) {
        res.json({error: "class does not exist"});
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        db.updateAssignmentGrade(studentID, user.courses[classID].courseId,
                                 assignments[assignmentID]._id, grade).catch((err) => {
            res.json({error: err});
        });
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
    if (!user.courses[classID]) {
        res.json({error: "class does nto exist"});
        return;
    }
    db.getAssignmentsForCourse(user.courses[classID].courseId).then((assignments) => {
        if (assignments.length <= assignmentID) {
            res.redirect(`/class/${classID}`);
            return;
        }
        db.updateAssignmentGrade(studentID, user.courses[classID].courseId, assignments[assignmentID]._id,
                                 undefined, comment).catch((err) => {
            res.json({error: err});
        });
    });
});

module.exports = router;
