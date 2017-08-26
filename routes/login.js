const express = require('express');
const router = express.Router();
const passport = require("passport");
const db = require("../data");

router.get("/", (req, res) => {
    // if user already logged in shuold redirect to classes page
    if (req.user) {
        res.redirect('/class');
        return;
    }
    res.render('login/login');
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        return db.accountLocked(req.body.username).then((lockData) => {
            if (lockData.locked) {
                let date = new Date(lockData.lockAccountUntil);
                let data = {
                    hasErrors: true,
                    errors: [`${lockData.failedLoginAttempts} failed login attempts. Your account has been locked until ${date}`]
                };
                return res.render('login/login', data);
            }
            if (!user) {
                // Login failed
                return db.failedLoginAttempt(req.body.username, lockData.failedLoginAttempts).then(() => {
                    return res.redirect('/login');
                });
            }
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                if (user.failedLoginAttempts > 0) {
                    return db.resetLoginAttempts(user._id, user.isStudent).then(() => {
                        return res.redirect('/class');
                    });
                }
                return res.redirect('/class');
            });
        });
    })(req, res, next);
});

module.exports = router;
