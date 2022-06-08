const User = require('../models/user');

const VALIDATION_ERROR = 400;
const DOCUMENT_NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;


// Read
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// Read
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name ==='CastError') {
        return res.status(DOCUMENT_NOT_FOUND_ERROR).send({message:"Пользователь по указанному _id не найден."})
      } else {res.status(INTERNAL_SERVER_ERROR).send({message: "Ошибка по умолчанию."})}
    });
};

// Create
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name ==='ValidationError') {
        return res.status(VALIDATION_ERROR).send({message:"Переданы некорректные данные при создании пользователя."})
      } else {res.status(INTERNAL_SERVER_ERROR).send({message: "Ошибка по умолчанию."})}
    });
};

// Update user
module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    { name: req.body.name },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name ==='ValidationError') {
        return res.status(VALIDATION_ERROR).send({message:"Переданы некорректные данные при обновлении профиля."})
      } else if (err.name ==='CastError') {
        return res.status(DOCUMENT_NOT_FOUND_ERROR).send({message:"Пользователь по указанному _id не найден."})
      } else {res.status(INTERNAL_SERVER_ERROR).send({message: "Ошибка по умолчанию."})}
    });
}


// Update avatar
module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
    }
  )
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name ==='ValidationError') {
        return res.status(VALIDATION_ERROR).send({message:"Переданы некорректные данные при обновлении аватара."})
      } else if (err.name ==='CastError') {
        return res.status(DOCUMENT_NOT_FOUND_ERROR).send({message:"Пользователь по указанному _id не найден."})
      } else {res.status(INTERNAL_SERVER_ERROR).send({message: "Ошибка по умолчанию."})}
    });
}