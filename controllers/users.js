const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { ConflictError } = require('../errors/conflict-error');
const { ServerError } = require('../errors/server-error');
const { UnauthorizedError } = require('../errors/unauthorized-error');
const { ValidationError } = require('../errors/validation-error');
// Read
module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new ServerError('Произошла ошибка');
      }
      res.send({ data: users });
    })
    .catch(next);
};

// Read
module.exports.getUser = (req, res, next) => {
  if (req.params.userId === 'me') { req.params.userId = req.user._id; }
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(err.message);
      }
    })
    .catch(next);
};

// Create
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.code === 11000) {
        throw new ConflictError('Такой пользователь уже зарегистрирован!');
      }
    })
    .catch(next);
};

// Update user
module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

// Update avatar
module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.name === 'CastError') {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch(next);
};

// Login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => new UnauthorizedError(err.message))
    .catch(next);
};
