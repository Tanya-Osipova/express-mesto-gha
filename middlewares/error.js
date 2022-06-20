module.exports = (err, _req, res, next) => {
  const { statusCode = 400, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
