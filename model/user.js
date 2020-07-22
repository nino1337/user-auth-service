const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const User = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
});

const validateRegistration = (user) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  });

  return schema.validate(user);
};

const validateLogin = (credentials) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required(),
  });

  return schema.validate(credentials);
};

exports.User = mongoose.model('User', User);
exports.validateRegistration = validateRegistration;
exports.validateLogin = validateLogin;
