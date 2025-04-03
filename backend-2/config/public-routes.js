const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controller/user-controller');
const route = express.Router();

// User routes
route.get('/', auth.isLoggedIn, userController.renderHomePage);
route.get('/user/signup-login', userController.renderSignUpPage);
route.post('/user/signup-login', userController.signUp);
route.post('/user/login', userController.logIn);
route.get('/logout', userController.logOut);
route.get('/user', auth.isLoggedIn, userController.userPage);

//404 route
route.use(userController.notFoundPage);

module.exports = route;
