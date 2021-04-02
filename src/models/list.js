"use strict";
exports.__esModule = true;
exports.addList = void 0;
var express_1 = require("express");
var models_1 = require("../models");
var listRouter = express_1.Router();
// 리스트 추가
var addList = function (userId, title) {
    return models_1["default"].lists.create({
        data: {
            user_id: userId,
            title: title
        }
    });
};
exports.addList = addList;
