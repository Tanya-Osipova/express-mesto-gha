const jwt = require('jsonwebtoken');
const AnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AnauthorizedError('Необходима aавторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new AnauthorizedError('Необходима aавторизация');
  }

  req.user = payload;

  next();
};
