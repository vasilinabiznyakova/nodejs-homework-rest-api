const { HttpError, ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contact");

const listContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const { _id: owner } = req.user;
  const { favorite } = req.query;
  if (favorite) {
    const result = await Contact.find({ owner, favorite: true }, "", {
      skip,
      limit,
    }).populate("owner", "name email");
    res.json(result);
  } else {
    const result = await Contact.find({ owner }, "", {
      skip,
      limit,
    }).populate("owner", "name email");
    res.json(result);
  }
};

const addContact = async (req, res) => {
  // const { _id: owner } = req.user;
  const owner = req.user._id;
  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // const result = await Contact.findOne({ _id: id });
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404);
  }

  res.json({
    message: "Delete success",
  });
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  removeContact: ctrlWrapper(removeContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
