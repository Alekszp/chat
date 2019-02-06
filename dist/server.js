'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportJwt.Strategy(_config.jwt, function (jwt_payload, done) {
    if (jwt_payload != void 0) {
        return done(false, jwt_payload);
    }
    done();
}));

_mongoose2.default.set('debug', true);
_mongoose2.default.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });
_mongoose2.default.Promise = _bluebird2.default;

_mongoose2.default.set('debug', true);

var app = (0, _express2.default)();
var server = _http2.default.Server(app);
var io = (0, _socket2.default)(server, {
    serveClient: true
});

_nunjucks2.default.configure('./client/views', {
    autoescape: true,
    express: app
});

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _cookieParser2.default)());

(0, _router2.default)(app);
(0, _sockets2.default)(io);

// app.get('/', (req, res) => {
//     // res.send('Hello World')
//     // res.sendFile(path.join(__dirname + 'index.html'))

//     res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
// })

server.listen(8080, function () {
    console.log('Server is up and running on port 8080');
});