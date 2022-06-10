const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя карточки не указано'],
    minlength: [2, 'Слишком короткое имя(min.2)'],
    maxlength: [30, 'Слишком длинное имя(max.30)'],
  },
  link: {
    type: String,
    required: [true, 'Укажите ссылку'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Пользователь с таким _id не найден'],
  },
  likes: {
    type: Array,
    default: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },

});

module.exports = mongoose.model('card', cardSchema);
