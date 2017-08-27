const mongoCollections = require("./config/mongoCollections");
const del = require('del');
const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollections.courses;
const assignments = mongoCollections.assignments;

//removes database and then deletes files in file_uploads
let clear = (() => {
    students().then((collection) => {
        collection.remove({});
    }).then(() => {
        teachers().then((collection) => {
            collection.remove({});
            return courses().then((collection) => {
                collection.remove({});
                return assignments().then((collection) => {
                    collection.remove({});
                }).then(() => {
                    del(['file_uploads/*', '!file_uploads/.gitignore']).then(paths => {
                        console.log('Deleted files and folders:\n', paths.join('\n'));
                    });
                });
            });
        });
    });
});

clear();

module.exports = {clear};