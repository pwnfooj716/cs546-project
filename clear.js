const mongoCollections = require("./config/mongoCollections");
const del = require('del');
const students = mongoCollections.students;
const teachers = mongoCollections.teachers;
const courses = mongoCollections.courses;
const assignments = mongoCollections.assignments;

//removes database and then deletes files in file_uploads
module.exports = () => {
    return students().then((collection) => {
		return collection.remove({});
    }).then(() => {
        return teachers().then((collection) => {
            return collection.remove({}).then(() => {
				return courses().then((collection) => {
					return collection.remove({}).then(() => {
						return assignments().then((collection) => {
							return collection.remove({});
						}).then(() => {
							return del(['file_uploads/*', '!file_uploads/.gitignore']).then(paths => {
								console.log('Deleted files and folders:\n', paths.join('\n'));
							});
						});
					});
				});
			});
        });
    });
};
