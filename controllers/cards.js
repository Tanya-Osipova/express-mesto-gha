const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const { ValidationError } = require('../errors/validation-error');

// Read
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Create
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
    })
    .catch(next);
};

// Delete
module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий id карточки');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
    })
    .catch(next);
};

// Like: PUT
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      throw new ValidationError(err.message);
    }
  })
  .catch(next);

// Dislike: DELETE
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий id карточки');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      throw new ValidationError(err.message);
    }
  })
  .catch(next);
