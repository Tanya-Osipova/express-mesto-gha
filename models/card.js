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
    validate: {
      validator: (v) => {
        const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/;
        return v.match(regex);
      },
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Не указан владелец'],
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },

});

module.exports = mongoose.model('card', cardSchema);
