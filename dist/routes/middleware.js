"use strict";
exports.__esModule = true;
exports.isNotLoggedIn = exports.isLoggedIn = void 0;
var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send('로그인이 필요합니다.');
    }
};
exports.isLoggedIn = isLoggedIn;
var isNotLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).json({ 'message': '로그인한 사용자는 접근할 수 없습니다.' });
    }
};
exports.isNotLoggedIn = isNotLoggedIn;
