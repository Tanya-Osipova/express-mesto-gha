const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorized-error');

module.exports = (req) => {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer')) {
  //   throw new UnauthorizedError('Необходима авторизация');
  // }

  // const token = authorization.replace('Bearer ', '');
  const { token } = req.body;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
};
