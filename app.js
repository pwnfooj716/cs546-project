const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");
const app = express();
const db = require ("./data");
const bcrypt = require("bcryptjs");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
            db.getAuthByUsername(username).then((user) => {
                if (!user) return done(null, false, {message: "user not found"});
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) return done(err);
                    if (!res) return done(null, false, {message: "password does not match"});
                    return done(null, user);
                });
            });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    db.getAuthByID(id).then((user) => {
        done(null, user);
    });
});

app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});