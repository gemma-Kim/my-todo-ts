"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var bcrypt = require("bcrypt");
var passport = require("passport");
var models_1 = require("../models");
var middleware_1 = require("./middleware");
var userRouter = express_1.Router();
userRouter.post('/signup', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, inputEmail, inputPW, inputNickname, user, hashedPW, newUser, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, inputEmail = _a.email, inputPW = _a.password, inputNickname = _a.nickname;
                return [4 /*yield*/, models_1["default"].users.findUnique({
                        where: {
                            email: inputEmail
                        }
                    })];
            case 1:
                user = _b.sent();
                if (user) {
                    return [2 /*return*/, res.status(403).json({ 'message': '이미 존재하는 사용자입니다.' })];
                }
                return [4 /*yield*/, bcrypt.hash(inputPW, 12)];
            case 2:
                hashedPW = _b.sent();
                return [4 /*yield*/, models_1["default"].users.create({
                        data: {
                            email: inputEmail,
                            password: hashedPW
                        }
                    })];
            case 3:
                newUser = _b.sent();
                return [2 /*return*/, res.status(200).json(newUser)];
            case 4:
                err_1 = _b.sent();
                console.error(err_1);
                next(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
userRouter.post('/login', middleware_1.isNotLoggedIn, function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            return next(err);
        }
        ;
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, function (loginErr) { return __awaiter(void 0, void 0, void 0, function () {
            var userInfo, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (loginErr) {
                            return [2 /*return*/, next(loginErr)];
                        }
                        return [4 /*yield*/, models_1["default"].users.findUnique({
                                where: { id: user.id },
                                select: { id: true }
                            })];
                    case 1:
                        userInfo = _a.sent();
                        return [2 /*return*/, res.status(200).json(__assign(__assign({}, userInfo), { 'message': 'login success' }))];
                    case 2:
                        err_2 = _a.sent();
                        console.error(err_2);
                        next(err_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    })(req, res, next);
});
userRouter.post('/logout', middleware_1.isLoggedIn, function (req, res) {
    req.logout();
    req.session.destroy(function () {
        res.send('success to logout');
    });
});
// userRouter.get('/:id', isLoggedIn, async (req, res, next) => {
//   try {
//     const userInfo = await User.findOne({
//       where: { id: req.params.id },
//       attributes: ['id', 'nickname'],
//       include: [{
//         model: Todo,
//         attributes: ['id', 'body'],
//         order: ['createdAt', 'DESC'],
//       }],
//     })
//     if (!userInfo) {
//       return res.status(404).send('no user');
//     }
//     const jsonUser = userInfo.toJSON() as User;
//     return res.json(jsonUser);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// })
exports["default"] = userRouter;
