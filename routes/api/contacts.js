const express = require("express");

const { validation } = require("../../middlewares");
const { contactSchema } = require("../../schemas");

const { contacts: ctrl } = require("../../controllers");

const validateMiddleware = validation(contactSchema);

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateMiddleware, ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateMiddleware, ctrl.updateById);

module.exports = router;
