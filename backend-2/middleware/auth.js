const isLoggedIn = (req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    next();
  } else {
    res.redirect('/user/signup-login');
  }
};

const isSignUpLoginAnable = (req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    res.redirect('/user');
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isSignUpLoginAnable,
};
