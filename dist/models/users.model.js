"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var UsersSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    collection: "UsersCollection"
});

UsersSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = _bcryptjs2.default.hashSync(this.password, 12);
    }
    next();
});

exports.default = _mongoose2.default.model("UsersModel", UsersSchema);