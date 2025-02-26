const express = require("express");
const ctrl = require("../../controllers/auth");
const { validation, authenticate, upload } = require("../../middlewares");
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
router.post("/verify", ctrl.duplicateVerify);

router.get("/verify/:verificationCode", ctrl.verify);
// signin
router.post("/login", validation(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
