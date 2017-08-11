const lRoutes = require("./login");
const nRoutes = require("./new");
const cRoutes = require("./classes");

const constructorMethod = (app) => {
    app.use("/login", lRoutes);
    app.use("/new", nRoutes)
    app.use("/classes", cRoutes);

    app.use("/", (req, res) => {
        res.redirect("/login");
    })
    app.use("*", (req, res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructorMethod;