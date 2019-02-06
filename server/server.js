import express from 'express';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import http from 'http';
import nunjucks from 'nunjucks';
import ioClient from 'socket.io';
import sockets from "./sockets";
import router from "./router";
import passport from "passport";
import { Strategy } from "passport-jwt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {jwt} from "./config";

passport.use(new Strategy(jwt, function (jwt_payload, done) {
    if(jwt_payload != void(0)){
        return done(false, jwt_payload);
    }
    done();
}));

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true });
mongoose.Promise = Promise;

mongoose.set('debug', true)


const app = express();
const server = http.Server(app);
const io = ioClient(server, {
    serveClient: true
});

nunjucks.configure('./client/views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

router(app);
sockets(io);

// app.get('/', (req, res) => {
//     // res.send('Hello World')
//     // res.sendFile(path.join(__dirname + 'index.html'))

//     res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
// })

server.listen(8080, () => {
    console.log(`Server is up and running on port 8080`);
});