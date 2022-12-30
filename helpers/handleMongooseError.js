const handleMongooseError = (error, data, next) => {
  if (error.name === "ValidationError") {
    error.status = 400;
  }
  next();
};

module.exports = handleMongooseError;
