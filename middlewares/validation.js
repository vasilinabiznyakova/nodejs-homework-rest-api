const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.this.status = 400;
      next(error);
      return;
    }
    next();
  };
};

module.exports = validation;
