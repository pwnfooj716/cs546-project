const uuid = require("uuid/v4");
const mongoCollections = require("../config/mongoCollections");

const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollections.courses;
const assignments = mongoCollections.assignments;

function addCourseToTeacher(teacherId, courseId) {
	if (typeof teacherId != "string") {
		return Promise.reject("StudentId must be a string");
	}
	if (typeof courseId != "string") {
		return Promise.reject("ClassId must be a string");
	}

	let courseInfo = {
		courseId: courseId,
		isCurrentlyTeaching: true
	};

	return teachers().then((collection) => {
		return collection.update({_id: teacherId}, {$addToSet: {courses: courseInfo}}).then(() => {
			return courseId;
		});
	});
}

function addCourse(courseName, teacherId) {
	if (typeof courseName != "string") {
		return Promise.reject("Course Name must be provided");
	}
	
	let newCourse = {
		_id: uuid(),
		courseName: courseName,
		teacherId: teacherId,
		studentIDs: [],
		assignments: []
	}

	return courses().then((collection) => {
		return collection.insertOne(newCourse).then((information) => {
			return information.insertedId;
		});
	});
}

function addAssignment(newAssignment) {
	if (typeof newAssignment != "object") {
		return Promise.reject("Assignment must be provided");
	}

	newAssignment._id = uuid();
	newAssignment.submissions = [];
	
	return assignments().then((collection) => {
		return collection.insertOne(newAssignment);
	});
}

function addAssignmentToCourse(courseId, assignmentId) {
	return Promise.reject("Not yet implemented");
}

function updateCourseGrade(studentId, courseId, grade) {
	return Promise.reject("Not yet implemented");
}

function getStudent(studentId) {
    return students().then((collection) => {
        return collection.findOne({ _id: studentId }).then((student) => {
        	if (!student) throw "student not found";
        	return student;
		})
    });
}

function getTeacher(teacherId) {
    return teachers().then((collection) => {
        return collection.findOne({ _id: teacherId }).then((teacher) => {
            if (!teacher) throw "teacher not found";
            return teacher;
        })
    });
}

function getCourse(courseId) {
	return courses().then((collection) => {
		return collection.findOne({_id: courseId}).then((course) => {
			if (!course) throw "course not found";
			return course;
		});
	});
}

module.exports = {
	// User: Teacher
	addStudent(newStudent) {
		if (typeof newStudent != "object") {
			return Promise.reject("Student must be provided");
		}

		newStudent.courses = [];

		return students().then((collection) => {
			return collection.insertOne(newStudent);
		});
	},
	// User: Teacher
	addTeacher(newTeacher) {
		if (typeof newTeacher != "object") {
			return Promise.reject("Teacher must be provided");
		}

		newTeacher.courses = [];

		return teachers().then((collection) => {
			return collection.insertOne(newTeacher);
		});
	},
	// User: Teacher
	addStudentToCourse(studentId, courseId) {
		if (typeof studentId != "string") {
			return Promise.reject("StudentId must be a string");
		}
		if (typeof courseId != "string") {
			return Promise.reject("ClassId must be a string");
		}

		return courses().then((collection) => {
			return collection.update({_id: courseId}, {$addToSet: {studentIDs: studentId}}).then(() => {
				let courseInfo = {
					courseId: courseId,
					grade: NaN,
					isCurrentlyTaking: true
				}

				return students().then((collection) => {
					return collection.update({_id: studentId}, {$addToSet: {courses: courseInfo}});
				});
			});
		});
	},
	// User: Teacher
	createCourseForTeacher(teacherId, courseName) {
		return addCourse(courseName, teacherId).then((courseId) => {
			return addCourseToTeacher(teacherId, courseId);
		});
	},
	// User: Teacher
	createAssignmentForCourse(courseId, newAssignment) {
		return addAssigment(newAssignment).then((assignmentId) => {
			return addAssignmentToCourse(courseId, assignmentId);
		});
	},
	// User: Teacher || Student
	// Why do we need this?
	getAssignmentsForCourse(courseId) {
		return courses().then((collection) => {
			return collection.findOne({_id: courseId}).then((course) => {
				return course.assignments;
			});
		});
	},
	// User: Teacher
	updateAssignmentInfo(assignmentId, newInfo) {
		return assignments().then((collection) => {
			return collection.update({_id: assigmentId, newInfo});
		});
	},
	// User: Teacher
	updateAssignmentGrade(studentId, assignmentId, grade, teacherResponse) {
		return assignments().then((collection) => {
			return collection.findOne({ _id: assignmentId }).then((assignment) => {
				assignment.submissions.forEach((submission) => {
					if (submission.studentId === studentId) {
						submission.grade = grade;
						submission.teacherResponse = teacherResponse;
					}
				});
			});
		});
	},
	// User: Student
	updateAssignmentSubmission(studentId, assignmentId, submission) {
		return assignments().then((collection) => {
			return collection.findOne({ _id: assignmentId }).then((assignment) => {
				assignment.submissions.forEach((submission) => {
					if (submission.studentId === studentId) {
						submission.submission = submission;
						submission.submissionDate = new Date();// current date
					}
				});
			});
		});
	},
	// User : Student 
	getCoursesForStudent(studentId) {
		return getStudent(studentId).then((student) => {
			let coursesIds = student.courses.map((x) => {return x.courseId});
			if (coursesIds.length===0) return [];
			return courses().then((collection) => {
				return collection.find({_id: {$in: coursesIds}}, {courseName: 1}).then((courses) => {
					if (courses.length != student.courses.length) throw ("courses missing");
					let result = [];
					for (let x = 0; x < courses.length; x++) {
						result.push({index: x, name: courses[x].courseName, grade: student.courses[x].grade, isCurrentlyTaking: student.courses[x].isCurrentlyTaking});
					}
					return result;
				});
			});
		});
	},
	// User : Teacher
	getCoursesForTeacher(teacherId) {
		return getTeacher(teacherId).then((teacher) => {
			let coursesIds = teacher.courses.map((x) => {return x.courseId});
			return courses().then((collection) => {
				return collection.find({_id: {$in: coursesIds}}, {courseName: 1}).toArray().then((courses) => {
					if (courses.length != teacher.courses.length) throw ("courses missing");
					let result = [];
					for (let x = 0; x < courses.length; x++) {
						result.push({index: x, name: courses[x].courseName, isCurrentlyTeaching: teacher.courses[x].isCurrentlyTeaching});
					}
					return result;
				});
			});
		});
	},
	//User : Teacher || Student
	getCourse(courseID) {
		return courses().then((collection) => {
			return collection.find({_id: courseID}).then((course) => {
				return course;
			});
		});
	},
	//User: Teacher
	getStudents(studentIds) {
		return students().then((collection) => {
			return collection.find({_id: {in: studentIds}}).toArray().then((students) => {
				return students;
			})
		});
	},
	//User: Student || Teacher
	checkAuth(id, username) {
		return students().then((collection)=> {
			return collection.find({$or: [{_id: id}, {username: username}]}).toArray().then((results)=> {
				if (results.length)
					throw "user already exists";
				else
                    return teachers().then((collection) => {
                        return collection.find({$or: [{_id: id}, {username: username}]}).toArray().then((results)=> {
                            if (results.length)
                                throw "user already exists";

                            return true;
                        });
                    });
			});
		});
	},
	//User: Student || Teacher
	getAuthByUsername(username) {
        return students().then((collection)=> {
            return collection.findOne({username: username}).then((user)=> {
                if (user) {
                	user.isStudent = true;
                    return user;
                }
                else
                    return teachers().then((collection) => {
                    	return collection.findOne({username: username}).then((user)=> {
                    		if (user)
                    			user.isTeacher = true;
                        	return user;
                    });
                });
            });
        });
	},
    getAuthByID(id) {
        return students().then((collection)=> {
            return collection.findOne({_id: id}).then((user)=> {
                if (user) {
                    user.isStudent = true;
                    return user;
                }
                else
                    return teachers().then((collection) => {
                        return collection.findOne({_id: id}).then((user)=> {
                            if (user)
                                user.isTeacher = true;
                            return user;
                        });
                    });
            });
        });
    }
}
