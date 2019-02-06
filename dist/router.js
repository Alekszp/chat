"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (app) {
    var _this = this;

    app.use('/assets', _express2.default.static('./client/public'));

    app.get('/', chechAuth, function (req, res) {
        res.render('index.html', { username: req.user.username });
    });

    app.post('/login', function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
            var user, token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return _users2.default.findOne({ username: { $regex: _lodash2.default.escapeRegExp(req.body.username), $options: "i" } }).lean().exec();

                        case 3:
                            user = _context.sent;


                            console.log(config);
                            if (user != void 0 && _bcryptjs2.default.compareSync(req.body.password, user.password)) {
                                token = createToken({
                                    id: user._id,
                                    username: user.username
                                });


                                res.cookie('token', token, { httpOnly: true });
                                res.status(200).send({ message: "User login success" });
                            } else {
                                res.status(400).send({ message: "User not exist or password not a correct" });
                            }
                            _context.next = 13;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.error(_context.t0);
                            console.log(config);
                            res.status(500).send({ message: "Error ! Can not login" });

                        case 13:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 8]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
    app.post('/register', function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
            var user, token;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return _users2.default.findOne({ username: { $regex: _lodash2.default.escapeRegExp(req.body.username), $options: "i" } }).lean().exec();

                        case 3:
                            user = _context2.sent;

                            if (!(user != void 0)) {
                                _context2.next = 6;
                                break;
                            }

                            return _context2.abrupt("return", res.status(400).send({ message: "User already exist" }));

                        case 6:
                            _context2.next = 8;
                            return _users2.default.create({
                                username: req.body.username,
                                password: req.body.password
                            });

                        case 8:
                            user = _context2.sent;
                            token = createToken({
                                id: user._id,
                                username: user.username
                            });


                            res.cookie('token', token, { httpOnly: true });

                            res.status(200).send({ message: "User created" });
                            _context2.next = 18;
                            break;

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2["catch"](0);

                            console.error(_context2.t0);
                            res.status(500).send({ message: "Error Error Alarm !!! Danger Вопасносте!" });

                        case 18:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this, [[0, 14]]);
        }));

        return function (_x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    }());

    app.post('/logout', function (req, res) {
        res.clearCookie('token');
        res.status(200).send({ message: "Logout success" });
    });
};

var _users = require("./models/users.model");

var _users2 = _interopRequireDefault(_users);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require("./config");

var config = _interopRequireWildcard(_config);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("babel-polyfill");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function chechAuth(req, res, next) {
    _passport2.default.authenticate('jwt', { session: false }, function (err, decryptToken, jwtError) {
        if (jwtError != void 0 || err != void 0) {
            return res.render('index.html', { error: err || jwtError });
        }
        req.user = decryptToken;
        next();
    })(req, res, next);
}

function createToken(body) {
    return _jsonwebtoken2.default.sign(body, config.jwt.secretOrKey, { expiresIn: config.expiresIn });
}

console.log(config);

;