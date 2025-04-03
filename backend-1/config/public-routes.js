const express = require('express');
const postController = require('../controller/post-controller');
const route = express.Router();

// Routes
route.get('/', postController.homePage);

//404 route
// route.get('/*', postController.notFoundPage);
route.use((req, res) => {
  res.status(404).render('404-page');
});

module.exports = route;
