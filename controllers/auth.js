const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(404);
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const duplicateVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email"); // "Email invalid"
  }
  const user = await User.findOne({ email });
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed"); // "Email invalid"
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid"); // "Email invalid"
  }

  if (!user.verify) {
    throw HttpError(401, "Email or password invalid"); // "Email invalid"
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid"); // "Password invalid"
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    name: user.name,
    email: user.email,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "No content",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    subscription,
  });
};
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);

  const newFileName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, newFileName);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join(BASE_URL, "avatars", newFileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  duplicateVerify: ctrlWrapper(duplicateVerify),
};
