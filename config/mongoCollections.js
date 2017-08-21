const dbConnection = require("./mongoConnection");

let getCollectionFn = (collection) => {
	let _col = undefined;

	return () => {
		if (!_col) {
			_col = dbConnection().then(db => {
				return db.collection(collection);
			});
		}

		return _col;
	};
};

module.exports = {
	students: getCollectionFn("students"),
	teachers: getCollectionFn("teachers"),
	courses: getCollectionFn("courses"),
	assignments: getCollectionFn("assignments")
};
