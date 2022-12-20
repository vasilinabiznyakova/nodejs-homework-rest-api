const contactOperations = require("../../models/contacts");
const Joi = require("joi");
const { NotFound } = require("http-errors");

const contuctSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string().required(),
});

const updateById = async (req, res, next) => {
  try {
    const { error } = contuctSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const id = req.params.contactId;
    const result = await contactOperations.updateById(id, req.body);

    if (!result) {
      throw new NotFound(`Product with id=${id} not found!`);
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateById;
