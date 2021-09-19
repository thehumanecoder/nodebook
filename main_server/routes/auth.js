const express = require('express');
const routes = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/authController');


routes.post('/register', [
    body('name').notEmpty().withMessage('name can not be empty'),
    body('email').notEmpty().withMessage('email can not be empty'),
    body('password').notEmpty().withMessage('password can not be empty'),
    body('username').notEmpty().withMessage('username can not be empty'),
], controller.registerUser);


routes.post('/signin', [
    body('login').notEmpty().withMessage('login can not be empty'),
    body('password').notEmpty().withMessage('password can not be empty'),
    body('mode').notEmpty().withMessage('mode can not be empty'),
], controller.signinUser)

module.exports = routes;