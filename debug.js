const mongoCollections = require("./config/mongoCollections");

const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollections.courses;
const assignments = mongoCollections.assignments;

//let test = process.env.TEST;
let test=2;
if (test == 1) {
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
                               });
                           });
                       });
                    });
                });
            });
        });
    });
    console.log("data");
}

if (test == 2) {
    students().then((collection) => {
        collection.remove({});
    }).then(()=>{
        teachers().then((collection) => {
            collection.remove({});
            courses().then((collection) => {
                collection.remove({});
                assignments().then((collection) => {
                   collection.remove({});
                });
            });
        });
    });
    console.log("clear");
}