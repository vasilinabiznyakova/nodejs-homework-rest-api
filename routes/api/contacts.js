const express = require("express");

const { validation } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const ctrl = require("../../controllers/contacts");

const validateMiddleware = validation(schemas.addContactSchema);

const router = express.Router();

router.get("/", ctrl.listContacts);

router.get("/:id", ctrl.getContactById);

router.post("/", validateMiddleware, ctrl.addContact);

router.delete("/:id", ctrl.removeContact);

router.put("/:id", validateMiddleware, ctrl.updateById);

router.patch(
  "/:id/favorite",
  validation(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
