"use strict";
exports.__esModule = true;
var express = require("express");
var dotenv = require("dotenv");
var cors = require("cors");
var morgan = require("morgan");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var passport_1 = require("./passport");
var server_1 = require("./server");
var routes_1 = require("./routes");
dotenv.config();
var app = express();
// basic middlewear
//express.static('uploads')
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport_1["default"]();
app.use(routes_1["default"]);
app.use(cors);
// middelewear
if (server_1.prod) {
    app.use(morgan('combined'));
}
else {
    app.use(morgan('dev'));
}
exports["default"] = app;
