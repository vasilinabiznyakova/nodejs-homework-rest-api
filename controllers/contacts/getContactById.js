const contactOperations = require("../../models/contacts");
const { NotFound } = require("http-errors");

const getContactById = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contactOperations.getContactById(id);
    if (!result) {
      throw new NotFound(`Product with id=${id} not found!`);
      // throw createError(404, `Product with id=${contactId} not found!`);
      // const error = new Error(`Product with id=${contactId} not found!`);
      // error.status = 404;
      // throw error;
      // res.status(404).json({
      //   status: "error",
      //   code: 404,
      //   message: `Product with id=${contactId} not found!`,
      // });
      // return;
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
  // console.log(id);
  // const [contact] = contacts.filter((el) => el.id === id);
  // res.json({
  //   status: "success",
  //   code: 200,
  //   data: { contact },
  // });
};

module.exports = getContactById;
