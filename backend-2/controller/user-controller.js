const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const renderSignUpPage = (req, res) => {
  res.render('signup-login', {
    signUpErrMessage: null,
    signUpMessage: null,
    noUserMessage: null,
    wrongSignupPassMessage: null,
    wrongLoginPassMessage: null,
  });
};

const signUp = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  console.log('User inputs: ', req.body);

  // Check all the field not empty
  if (!first_name || !last_name || !email || !password || !confirm_password) {
    return res.render('signup-login', {
      signUpErrMessage: 'All fields must be filled!',
      signUpMessage: null,
      noUserMessage: null,
      wrongSignupPassMessage: null,
      wrongLoginPassMessage: null,
    });
  }

  // Compare two unputed passwords
  if (password !== confirm_password) {
    return res.render('signup-login', {
      signUpErrMessage: 'Passwords do not match!',
      signUpMessage: null,
      noUserMessage: null,
      wrongSignupPassMessage: null,
      wrongLoginPassMessage: null,
    });
  }

  // Check if user with this email is alredy exist
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.render('signup-login', {
      signUpErrMessage:
        'This email is already registered! Please try again with another one.',
      signUpMessage: null,
      noUserMessage: null,
      wrongSignupPassMessage: null,
      wrongLoginPassMessage: null,
    });
  }

  // Hash the password before saving in DB
  const hashedPass = bcrypt.hashSync(password, 10);

  // Update user data with hashed password
  const userData = { first_name, last_name, email, password: hashedPass };

  // Create new user in DB and save
  const newUser = new userModel(userData);
  newUser
    .save()
    .then(() => {
      res.render('signup-login', {
        signUpErrMessage: null,
        signUpMessage: 'User successfully registered. You can log in now.',
        noUserMessage: null,
        wrongSignupPassMessage: null,
        wrongLoginPassMessage: null,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Log in
const logIn = async (req, res) => {
  const { email, password } = req.body;
  // First: check if the user is exist
  const existedUser = await userModel.findOne({ email });

  if (!existedUser) {
    return res.render('signup-login', {
      signUpErrMessage: null,
      signUpMessage: null,
      noUserMessage: 'The user does not exist. Sign up first, please.',
      wrongSignupPassMessage: null,
      wrongLoginPassMessage: null,
    });
  }

  // Second: check if the password is correct
  const isCorrectPass = await bcrypt.compare(password, existedUser.password);
  if (!isCorrectPass) {
    return res.render('signup-login', {
      signUpErrMessage: null,
      signUpMessage: null,
      noUserMessage: null,
      wrongSignupPassMessage: null,
      wrongLoginPassMessage: 'The password is not correct',
    });
  }

  // Third: create a token
  const userInfo = {
    id: existedUser._id,
    first_name: existedUser.first_name,
    last_name: existedUser.last_name,
    email: existedUser.email,
  };
  const userToken = jwt.sign({ userInfo }, 'User is JWT now', {
    expiresIn: '24h',
  });

  //Fourth: set token into the cookie
  res.cookie('authToken', userToken);

  // Lead to user page
  return res.redirect('/user');
};

// Get user data from the cookies
const userPage = (req, res) => {
  const decodedToken = jwt.verify(req.cookies.authToken, 'User is JWT now');
  if (!decodedToken) {
    return res.redirect('/');
  }
  const userInfo = decodedToken.userInfo;
  res.render('user-page', { userInfo });
};

const logOut = (req, res) => {
  res.clearCookie('authToken');
  res.redirect('/');
};

const notFoundPage = (req, res) => {
  res.render('404page');
};

module.exports = {
  signUp,
  renderSignUpPage,
  logIn,
  logOut,
  userPage,
  notFoundPage,
};
