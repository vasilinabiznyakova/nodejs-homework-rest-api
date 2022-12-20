const contactOperations = require("../../models/contacts");
const { NotFound } = require("http-errors");

const removeContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contactOperations.removeContact(id);
    if (!result) {
      throw new NotFound(`Product with id=${id} not found!`);
    }
    res.json({
      status: "success",
      code: 200,
      message: "contact deleted",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = removeContact;
