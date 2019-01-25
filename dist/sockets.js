'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _messeges = require('./models/messeges.model');

var _messeges2 = _interopRequireDefault(_messeges);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = function socket(io) {
    io.on('connection', function (socket) {
        socket.emit('connected', "{hello: 'world'}");

        socket.join('all');

        socket.on('msg', function (content) {
            var obj = {
                date: new Date(),
                content: content,
                username: socket.id
            };

            _messeges2.default.create(obj, function (err) {
                if (err) {
                    return console.error(err);
                };
                socket.emit('message', obj);
                socket.to('all').emit('message', obj);
            });
        });
        socket.on('receiveHistory', function () {
            _messeges2.default.find({}).sort({ date: -1 }).limit(50).sort({ date: -1 }).lean().exec(function (err, messages) {
                if (!err) {
                    socket.emit("history", messages);
                }
            });
        });
    });
};

exports.default = socket;