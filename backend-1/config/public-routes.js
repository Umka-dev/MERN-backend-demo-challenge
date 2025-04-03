const express = require('express');
const postController = require('../controller/post-controller');
const route = express.Router();

// Routes
route.get('/', postController.homePage);
route.get('/article/:postId', postController.getArticle);
route.get('/new/article', postController.addArticleForm);
route.post('/new/article', postController.addArticle);
route.post('/edit/article/:postId', postController.editArticle);
route.post('/delete/article/:postId', postController.deleteArticle);

//404 route
route.use(postController.notFoundPage);

module.exports = route;
