const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, _res, next) => {
  req.user = {
    _id: '629e185dd9b1e64e9655ee89',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.get('*', (_req, res) => {
  res.status(404).send({ message: 'Не найдено' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
