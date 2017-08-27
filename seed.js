const data = require("./data");
const bcrypt = require("bcryptjs");
const clear = require("./clear");

clear.clear().then(() => {
        return data.addTeacher("00000001", "TA", "TeacherA", "T1", bcrypt.hashSync("abc",8)).then(() => {
            console.log("Added teacher A with id: 00000001, username: T1 and password: abc");
            return data.addTeacher("00000002", "TB", "TeacherB", "T2", bcrypt.hashSync("cba",8)).then(()=> {
                console.log("Added teacher B with id: 00000002, username: T2 and password: cba");
                return data.addStudent("10000000", "SA", "StudentA", "S1", bcrypt.hashSync("def",8)).then(() => {
                   console.log("Added student A with id: 10000000, username: S1, and password: def");
                   return data.addStudent("20000000", "SB", "StudentB", "S2", bcrypt.hashSync("ghi",8)).then(() => {
                       console.log("Added student B with id: 20000000, username: S2, and password: ghi");
                       return data.addStudent("30000000", "SC", "StudentC", "S3", bcrypt.hashSync("jkl",8)).then(() => {
                           console.log("Added student C with id: 30000000, username: S3, and password: jkl");
                           return data.createCourseForTeacher("00000001","Class1",["10000000","20000000"]).then((courseID) => {
                              console.log("Class1 created by Teacher A with Students A and B");
                              return data.createAssignmentForCourse(courseID,"Assignment1","Submit 1 sentence detailing yourself","2017-08-03").then(() => {
                                 console.log("Assignment1 for Class1");
                                 return data.createAnnouncementForCourse(courseID,"Assignment1","Just uploaded Assignment 1");
                              });
                           });
                       });
                   });
                });
            });
        });
    }).then(() => {
    console.log("Done seeding database");
}, (error) => {
    console.error(error);
});