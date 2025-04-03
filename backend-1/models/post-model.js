const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [26, 'Min length of the title should be over than 25 symbols'],
    required: true,
  },
  article: {
    type: String,
    minlength: [
      101,
      'Min length of the article should be over than 100 symbols',
    ],
    required: true,
  },
});

module.exports = mongoose.model('post', postSchema);
