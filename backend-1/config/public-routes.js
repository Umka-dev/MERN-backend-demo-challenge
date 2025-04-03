const express = require('express');
const postController = require('../controller/post-controller');
const route = express.Router();

// Routes
route.get('/', postController.homePage);
route.get('/new/article', postController.addArticleForm);
route.post('/new/article', postController.addArticle);

//404 route
route.use(postController.notFoundPage);

module.exports = route;
