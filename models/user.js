const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ' Имя не указано'],
    minlength: [2, 'Слишком короткое имя(min.2)'],
    maxlength: [30, 'Слишком длинное имя(max.30)'],
  },
  about: {
    type: String,
    required: [true, 'Пустое описание'],
    minlength: [2, 'Слишком короткое описание(min.2)'],
    maxlength: [30, 'Слишком длинное описание(max.30)'],
  },
  avatar: {
    type: String,
    required: [true, 'Линк на аватар не указан'],
  },
});

module.exports = mongoose.model('user', userSchema);
