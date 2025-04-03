const postModel = require('../models/post-model');

const homePage = (req, res) => {
  postModel
    .find()
    .then((posts) => {
      res.render('home-page', { posts, titleErr: null, articleErr: null });
    })
    .catch((err) => {
      console.log('Error fetching posts:', err);
      res.status(500).send('Internal Server Error');
    });
};

const addArticleForm = (req, res) => {
  res.render('add-article-page', {
    titleErr: null,
    articleErr: null,
  });
};

const addArticle = (req, res) => {
  const article = new postModel(req.body);
  article
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      //   console.error('Validation error:', err);

      if (err.errors && (err.errors.title || err.errors.article)) {
        postModel
          .find()
          .then((posts) => {
            return res.render('add-article-page', {
              titleErr: err.errors.title,
              articleErr: err.errors.article,
            });
          })
          .catch((err) => {
            console.log('Error fetching posts:', err);
            res.status(500).send('Internal Server Error');
          });
      }
    });
};

const notFoundPage = (req, res) => {
  res.status(404).render('404-page', {
    titleErr: null,
    articleErr: null,
  });
};

module.exports = {
  homePage,
  addArticleForm,
  addArticle,
  notFoundPage,
};
