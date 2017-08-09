const uuid = require("uuid/v4");
const mongoCollections = require("./mongoCollections");

const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollectinos.classes;
const assignments = mongoCollections.assignments;

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
	addStudentCourse(studentId, courseId) {
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
		};

		return students().then((collection) => {
			return collection.update({_id: studentId}, {$addToSet: {courses: courseInfo}});
		});
	},
	addTeacherCourse(teacherId, courseId) {
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
	},
	addCourse(newCourse) {
		if (typeof newCourse != "object") {
			return Promise.reject("Course must be provided");
		}

		newCourse._id = uuid();
		newCourse.studentIDs = [];
		newCourse.assignments = [];

		return courses().then((collection) => {
			return collection.insertOne(newCourse);
		});
	},
	addAssignment(newAssignment) {
		if (typeof newAssignment != "object") {
			return Promise.reject("Assignment must be provided");
		}

		newAssignment._id = uuid();
		teacherResponse: undefined;

		return assignments().then((collection) => {
			return collection.insertOne(newAssignment);
		});
	}
}
