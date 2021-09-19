const { validationResult } = require('express-validator');
const User = require("../models/user");
const encrypter = require('../helpers/authentication/encrypter');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.registerUser = async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 0,
            message: 'Incomplete request data',
            errors: errors.array()
        })
    }

    const { name, email, password, username } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(403).json({
        status: 0,
        message: 'User already exists'
    });


    const encrypted = await encrypter.setPassword(password);

    const user = await User.create({
        name,
        email,
        hashed_password: encrypted.password,
        salt: encrypted.salt,
        username
    });

    console.log(user);

    await user.save();

    return res.status(200).json({
        status: 1,
        message: 'User created successfully',
    });
}


exports.signinUser = async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 0,
            message: 'Incomplete request data',
            errors: errors.array()
        })
    }

    const { login, password, mode } = req.body;

    if (mode == "email") {
        await User.findOne({ email: login }, (err, user) => {
            if (err || !user) return res.status(403).json({
                status: 0,
                message: 'User not found'
            })

            let isAutenticated = encrypter.checkPassword(password, user.hashed_password, user.salt);

            if (!isAutenticated) return res.status(401).json({
                status: 0,
                message: 'Wrong password or Username'
            })
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                data: {
                    _id: user._id,
                }
            }, process.env.app_secret_key);


            const { _id, name, email, username } = user;

            return res.status(200).json({
                status: 1,
                message: 'User autenticated successfully',
                datat: {
                    token,
                    user: { _id, name, email, username }
                }
            })
        });


    } else if (mode == "username") {
        await User.findOne({ username: login }, (err, user) => {
            if (err || !user) return res.status(403).json({
                status: 0,
                message: 'User not found'
            })

            let isAutenticated = encrypter.checkPassword(password, user.hashed_password, user.salt);

            if (!isAutenticated) return res.status(401).json({
                status: 0,
                message: 'Wrong password or Username'
            })
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                data: {
                    _id: user._id,
                }
            }, process.env.app_secret_key);


            const { _id, name, email, username } = user;

            return res.status(200).json({
                status: 1,
                message: 'User autenticated successfully',
                datat: {
                    token,
                    user: { _id, name, email, username }
                }
            })
        });

    }


}