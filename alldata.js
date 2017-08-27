const mongoCollections = require("./config/mongoCollections");

const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollections.courses;
const assignments = mongoCollections.assignments;

//prints out database
students().then((collection) => {
    collection.find({}).toArray().then((result) => {
        console.log("this is all students");
        console.log(result);
        teachers().then((collection)=> {
            collection.find({}).toArray().then((result) => {
                console.log("this is all teachers");
                console.log(result);
                courses().then((collection) => {
                    collection.find({}).toArray().then((result) => {
                        console.log("this is all courses");
                        console.log(result);
                        assignments().then((collection)=> {
                            collection.find({}).toArray().then((result) => {
                                console.log("this is all assignments");
                                console.log(result);
								process.exit();
                            });
                        });
                    });
                });
            });
        });
    });
});
