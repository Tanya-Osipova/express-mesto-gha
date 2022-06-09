const Card = require('../models/card');

const VALIDATION_ERROR = 400;
const DOCUMENT_NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

// Read
module.exports.getCards = (req, res) => {
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
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
    });
};

// Delete
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
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
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    }
    if (err.name === 'CastError') {
      return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
  });

// Dislike: DELETE
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then()
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    }
    if (err.name === 'CastError') {
      return res.status(DOCUMENT_NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
  });
