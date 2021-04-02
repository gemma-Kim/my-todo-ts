"use strict";
exports.__esModule = true;
exports.findUniqueUser = exports.createNewUser = void 0;
var index_1 = require("./index");
var createNewUser = function (email, password) {
    return index_1["default"].users.create({
        data: {
            email: email,
            password: password
        },
        select: { id: true }
    });
};
exports.createNewUser = createNewUser;
var findUniqueUser = function (inputData) {
    var inputId = inputData.id, inputEmail = inputData.email;
    var user = index_1["default"].users.findUnique({
        where: {
            id: inputId,
            email: inputEmail
        },
        select: { id: true }
    });
    if (user) {
        return user;
    }
    return false;
};
exports.findUniqueUser = findUniqueUser;
