const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minlength: [2, 'Minimum length should be over than 1 symbol'],
  },
  last_name: {
    type: String,
    required: true,
    minlength: [2, 'Minimum length should be over than 1 symbol'],
  },
  email: {
    type: String,
    minlength: [8, 'Email length should be over than 7 symbols'],
    required: true,
    unique: [true, 'User with this email is already exist!'],
  },
  password: {
    type: String,
    minlength: [4, 'Password length should be be over than 3 symbols'],
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
