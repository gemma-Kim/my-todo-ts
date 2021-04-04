"use strict";
exports.__esModule = true;
var express_1 = require("express");
var user_1 = require("./user");
var todo_1 = require("./todo");
var router = express_1.Router();
router.use('/users', user_1["default"]);
router.use('/todos', todo_1["default"]);
exports["default"] = router;
