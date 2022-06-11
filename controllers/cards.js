const Card = require('../models/card');
const { VALIDATION_ERROR, DOCUMENT_NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require('../utils/constants');

// Read
module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// Create
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: `Переданы некорректные данные при создании карточки:${err.message}` });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Delete
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR).send({ message: `Пользователь по указанному _id не найден: ${err.message}` });
      }
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: `Переданы некорректные данные для удаления: ${err.message}` });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// Like: PUT
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err.message}` });
    }
    if (err.name === 'CastError') {
      return res.status(VALIDATION_ERROR).send({ message: `Передан несуществующий _id карточки: ${err.message}` });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });

// Dislike: DELETE
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: `Переданы некорректные данные для постановки/снятии лайка: ${err.message}` });
    }
    if (err.name === 'CastError') {
      return res.status(VALIDATION_ERROR).send({ message: `Передан несуществующий _id карточки: ${err.message}` });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });
