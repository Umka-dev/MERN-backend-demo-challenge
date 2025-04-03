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
          .then(() => {
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

const getArticle = (req, res) => {
  postModel
    .findById(req.params.postId)
    .then((post) => {
      if (!post) {
        res.status(404).render('404page');
      }
      res.render('article-page', {
        post,
        titleErr: null,
        articleErr: null,
      });
    })
    .catch((err) => {
      console.error('Searching error:', err);
      res.status(500).send('Internal Server Error');
    });
};

const editArticleForm = (req, res) => {
  postModel
    .findById(req.params.postId)
    .then((post) => {
      res.render('edit-article-page', {
        post,
        titleErr: null,
        articleErr: null,
      });
    })
    .catch((err) => {
      console.error('Error:', err);
    });
};

const editArticle = (req, res) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(404).redirect('404');
  } else if (!req.body) {
    res.render('edit-article-page', {
      titleErr: err.errors.title,
      articleErr: err.errors.article,
    });
  } else {
    postModel
      .findByIdAndUpdate(postId, req.body, { new: true, runValidators: true })
      .then(() => {
        res.redirect(`/article/${postId}`);
      })
      .catch((err) => {
        console.error('Searching error:', err);
        res.status(500).send('Internal Server Error');
      });
  }
};

const deleteArticle = (req, res) => {
  const postId = req.params.postId;

  postModel
    .findByIdAndDelete(postId)
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(404).send('Post not found');
      }
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error');
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
  getArticle,
  editArticleForm,
  editArticle,
  deleteArticle,
  notFoundPage,
};
