import jwt from "jsonwebtoken";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import path from "path";
import gravatar from "gravatar";
import fs from "fs/promises";
import Jimp from "jimp";
import { AVATAR_IMG_SIZES } from "../constants/user-constants.js";

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const user = await authServices.findUser({ email: req.body.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(req.body.email, { s: 250, d: "mp" });

  const { email, subscription } = await authServices.signup({
    ...req.body,
    avatarURL,
  });

  res.status(201).json({ user: { email, subscription } });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await authServices.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id } = user;
  const payload = { id: _id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "20H" });

  const result = await authServices.updateUser({ _id }, { token });

  res.json({
    token,
    user: { email: result.email, subscription: result.subscription },
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: null });

  res.status(204).send();
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const { email, subscription } = await authServices.updateUser(
    { _id },
    req.body
  );

  res.json({ user: { email, subscription } });
};

const updateAvatar = async (req, res) => {
  const { _id, email } = req.user;

  if (!req.file) {
    throw HttpError(400, "No attached file");
  }

  const { path: oldPath, filename } = req.file;
  const { height, width } = AVATAR_IMG_SIZES.small;
  const newFileName = `${email}-${width}x${height}-${filename}`;
  const newPath = path.join(avatarsPath, newFileName);

  const avatarImg = await Jimp.read(oldPath);

  await avatarImg.resize(width, height).write(newPath);

  await fs.unlink(oldPath);

  const avatarURL = path.join("avatars", newFileName);
  await authServices.updateUser({ _id }, { avatarURL });

  res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
