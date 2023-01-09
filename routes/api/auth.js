const express = require("express");
const ctrl = require("../../controllers/auth");
const { validation, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.patch(
  "/",
  validation(schemas.subscriptionSchema),
  authenticate,
  ctrl.updateSubscription
);
// signup
router.post("/signup", validation(schemas.registerSchema), ctrl.register);
// signin
router.post("/login", validation(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
