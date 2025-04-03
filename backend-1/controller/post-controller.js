const postModel = require('../models/post-model');

const homePage = (req, res) => {
  postModel.find().then((posts) => {
    res.render('home-page', { posts });
  });
};

// const notFoundPage = (req, res) => {
//   res.status(404).render('404-page');
// };

module.exports = {
  homePage,
  //   notFoundPage,
};
