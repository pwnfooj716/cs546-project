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
		return collection.update({_id: teacherId}, {$addToSet: {courses: courseInfo}});
	});
}

function addCourse(newCourse) {
	if (typeof newCourse != "object") {
		return Promise.reject("Course must be provided");
	}

	newCourse._id = uuid();
	newCourse.studentIDs = [];
	newCourse.assignments = [];

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

module.exports = {
	addStudent(newStudent) {
		if (typeof newStudent != "object") {
			return Promise.reject("Student must be provided");
		}

		newStudent.courses = [];

		return students().then((collection) => {
			return collection.insertOne(newStudent);
		});
	},
	addTeacher(newTeacher) {
		if (typeof newTeacher != "object") {
			return Promise.reject("Teacher must be provided");
		}

		newTeacher.courses = [];

		return teachers().then((collection) => {
			return collection.insertOne(newTeacher);
		});
	},
	addStudentToCourse(studentId, courseId) {
		if (typeof studentId != "string") {
			return Promise.reject("StudentId must be a string");
		}
		if (typeof courseId != "string") {
			return Promise.reject("ClassId must be a string");
		}

		let courseInfo = {
			courseId: courseId,
			grade: undefined,
			isCurrentlyTaking: true
		}

		return students().then((collection) => {
			return collection.update({_id: studentId}, {$addToSet: {courses: courseInfo}});
		});
	},
	createCourseForTeacher(teacherId, newCourse) {
		addCourse(newCourse).then((courseId) => {
			return addCourseToTeacher(teacherId, courseId);
		});
	},
	createAssignmentForCourse(courseId, newAssignment) {
		addAssigment(newAssignment).then((assignmentId) => {
			return addAssignmentToCourse(courseId, assignmentId);
		});
	},
	getAssignmentsForCourse(courseId) {
		return Promise.reject("Not yet implemented");
	},
	getCoursesForAssignment(assignmentId) {
		return Promise.reject("Not yet implemeneted");
	},
	updateAssignmentGrade(studentId, assignmentId, grade, teacherResponse) {
		return Promise.reject("Not yet implemented");
	},
	updateAssignmentSubmission(studentId, assignmentId, submission) {
		return Promise.reject("Not yet implemented");
	},
	getCoursesForStudent(studentId) {
		return getStudent(studentId).then((student) => {
			let coursesIds = student.courses.map((x)=>{return x.courseId});
			return courses().then((collection) => {
				collection.find({_id: {$in: coursesIds}},{courseName: 1}).then((result) => {
					if (result.length != student.courses.length) throw ("courses missing");
					let final=[];
					for (let x=0; x<result.length; x++) {
						final.push({id: x, name: result[x], grade: student.courses[x].grade, isCurrentlyTaking: student.courses[x].isCurrentlyTaking});
					}
					return final;
				});
			});
		});
	},
	getCourseForTeacher(teacherId) {
		return Promise.reject("Not yet implemented")
	}
}
