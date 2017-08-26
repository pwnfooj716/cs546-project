const lRoutes = require("./login");
const nRoutes = require("./new");
const cRoutes = require("./classes");
const oRoutes = require("./logout");

const constructorMethod = (app) => {
    app.use("/login", lRoutes);
    app.use("/new", nRoutes)
    app.use("/class", cRoutes);
    app.use("/logout",oRoutes);

    app.use("/", (req, res) => {
        res.redirect("/login");
    })
    app.use("*", (req, res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructorMethod;