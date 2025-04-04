const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controller/user-controller');
const route = express.Router();

// User routes

route.get('/', userController.renderSignUpPage);
route.post('/signup', userController.signUp);
route.post('/login', userController.logIn);
route.get('/logout', userController.logOut);
route.get('/user', auth.isLoggedIn, userController.userPage);

//404 route
route.use(userController.notFoundPage);

module.exports = route;
