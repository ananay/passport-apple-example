const express = require('express');
const app = express();
const passport = require('passport');
const AppleStrategy = require('./lib/strategy.js');

app.get("/", (req, res) => {
    res.send("<a href=\"/login\">Sign in with Apple</a>");
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

passport.use(new AppleStrategy({
    clientID: "",
    teamID: "",
    callbackURL: "",
    keyID: "",
    privateKeyLocation: ""
}, function(accessToken, refreshToken, idToken, profile, cb) {
    // Here, check if the idToken exists in your database!
    cb(null, idToken);
}));

app.get("/login", passport.authenticate('apple'));
app.get("/auth", function(req, res, next) {
    passport.authenticate('apple', function(err, user, info) {
        if (err) {
            if (err == "AuthorizationError") {
                res.send("Oops! Looks like you didn't allow the app to proceed. Please sign in again! <br /> \
                <a href=\"/login\">Sign in with Apple</a>");
            } else if (err == "TokenError") {
                res.send("Oops! Couldn't get a valid token from Apple's servers! <br /> \
                <a href=\"/login\">Sign in with Apple</a>");
            }
        } else {
            res.send("Unique user ID: - " + user);
        }
    })(req, res, next);
});

app.listen(3000, () => {
    console.log("Server started on https://apple.exun.co");
});