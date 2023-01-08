const express = require("express");

const { validation, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const ctrl = require("../../controllers/contacts");

const validateMiddleware = validation(schemas.addContactSchema);

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts);

router.get("/:id", authenticate, ctrl.getContactById);

router.post("/", authenticate, validateMiddleware, ctrl.addContact);

router.delete("/:id", authenticate, ctrl.removeContact);

router.put("/:id", authenticate, validateMiddleware, ctrl.updateById);

router.patch(
  "/:id/favorite",
  validation(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
