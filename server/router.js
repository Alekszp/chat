import UsersModel from "./models/users.model";
import _ from "lodash";
import * as config from "./config";
import bcrypt from "bcryptjs";
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "babel-polyfill";

function chechAuth(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if (jwtError != void(0) || err != void(0)) {
            return res.render('index.html', { error: err || jwtError });
        }
        req.user = decryptToken;
        next();
    })(req, res, next);
}

function createToken(body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey, 
        {expiresIn: config.expiresIn}
    );
}

console.log(config);

export default function (app) {
    app.use('/assets', express.static('./client/public'));

    app.get('/', chechAuth, (req, res) => { 
        res.render('index.html', { username: req.user.username });
    });

    app.post('/login', async (req, res) => {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            

            console.log(config);
            if (user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({
                    id: user._id,
                    username: user.username
                });
    
                res.cookie('token', token, { httpOnly: true });
                res.status(200).send({ message: "User login success" });

            } else {
                res.status(400).send({ message: "User not exist or password not a correct" });
            }
        } catch (error) {
            console.error(error);
            console.log(config);
            res.status(500).send({message: "Error ! Can not login"});
        }
    });
    app.post('/register', async (req, res) => {
        try {
            let user = await UsersModel.findOne({ username: { $regex: _.escapeRegExp(req.body.username), $options: "i" }}).lean().exec();
            if (user != void(0)) {
                return res.status(400).send({ message: "User already exist" });
            }
            user = await UsersModel.create({
                username: req.body.username,
                password: req.body.password
            });
            const token = createToken({
                id: user._id,
                username: user.username
            });

            res.cookie('token', token, { httpOnly: true });

            res.status(200).send({ message: "User created" });
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Error Error Alarm !!! Danger Вопасносте!"})
        }
    });

    app.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({ message: "Logout success" })
    })
};
