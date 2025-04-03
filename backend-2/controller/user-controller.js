const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const renderHomePage = (req, res) => {
  res.redirect('/user/signup-login');
};

const renderSignUpPage = (req, res) => {
  res.render('signup-login', {
    signUpErrMessage: null,
    signUpMessage: null,
    noUserMessage: null,
    wrongPassMessage: null,
  });
};

const signUp = async (req, res) => {
  if (
    req.body.first_name === '' ||
    req.body.last_name === '' ||
    req.body.password === '' ||
    req.body.email === ''
  ) {
    return res.render('signup-login', {
      signUpErrMessage: 'All the fields should be filled!',
      signUpMessage: null,
      noUserMessage: null,
      wrongPassMessage: null,
    });
  }

  // bcrypt/hash the password
  if (req.body.password !== '') {
    // Hash password
    const hashedPass = bcrypt.hashSync(req.body.password, 10);
    const userData = {
      ...req.body,
      password: hashedPass, // replace the real password with the encrypted one
    };
    const newUser = new userModel(userData);
    newUser
      .save()
      .then((data) => {
        res.render('signup-login', {
          signUpErrMessage: null,
          signUpMessage: 'The user is signed up. You can log in now.',
          noUserMessage: null,
          wrongPassMessage: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// Log in
const logIn = async (req, res) => {
  // First: check if the user is exist
  const existedUser = await userModel.findOne({ email: req.body.email });

  if (existedUser) {
    // Second: check if the password is correct
    const isCorrectPass = bcrypt.compareSync(
      req.body.password,
      existedUser.password
    );
    if (isCorrectPass) {
      const userInfo = {
        id: existedUser._id,
        first_name: existedUser.first_name,
        last_name: existedUser.last_name,
        email: existedUser.email,
      };
      const userToken = await jwt.sign({ userInfo }, 'User is JWT now');

      res.cookie('authToken', userToken); // register user token inside the cookie
      return res.redirect('/user');
    } else {
      res.render('signup-login', {
        signUpErrMessage: null,
        signUpMessage: null,
        noUserMessage: null,
        wrongPassMessage: 'The password is not correct',
      });
    }
  } else {
    res.render('signup-login', {
      signUpErrMessage: null,
      signUpMessage: null,
      noUserMessage: 'The user does not exist. Sign up first, please.',
      wrongPassMessage: null,
    });
  }
};

// Get user data from the cookies
const userPage = (req, res) => {
  const decodedToken = jwt.verify(req.cookies.authToken, 'User is JWT now');
  if (!decodedToken) {
    return res.redirect('/user/signup-login');
  }
  const userInfo = decodedToken.userInfo;
  res.render('user-page', { userInfo });
};

const logOut = (req, res) => {
  res.clearCookie('authToken');
  res.redirect('/user/signup-login');
};

const notFoundPage = (req, res) => {
  res.render('404page');
};

module.exports = {
  renderHomePage,
  signUp,
  renderSignUpPage,
  logIn,
  logOut,
  userPage,
  notFoundPage,
};
