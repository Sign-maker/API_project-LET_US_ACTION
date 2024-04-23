import jwt from "jsonwebtoken";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import cloudinary from "../helpers/cloudinary.js";
import * as authServices from "../services/authServices.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";

import { updateDailyNorma } from "../services/waterServices.js";

const { JWT_SECRET } = process.env;

const makeToken = (id) => {
  const payload = { id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "20H" });

  return token;
};

const signup = async (req, res) => {
  const user = await authServices.findUser({ email: req.body.email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.signup({
    ...req.body,
  });

  const token = makeToken(newUser._id);

  const newUserWithToken = await authServices.updateUser(newUser._id, {
    token,
  });

  res.status(201).json({
    user: {
      name: newUserWithToken.name,
      email: newUserWithToken.email,
      gender: newUserWithToken.gender,
      avatarURL: newUserWithToken.avatarURL,
      dailyNorma: newUserWithToken.dailyNorma,
    },
    token: newUserWithToken.token,
  });
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
  const token = makeToken(_id);

  const userWithToken = await authServices.updateUser(_id, { token });

  res.json({
    user: {
      name: userWithToken.name,
      email: userWithToken.email,
      gender: userWithToken.gender,
      avatarURL: userWithToken.avatarURL,
      dailyNorma: userWithToken.dailyNorma,
    },
    token: userWithToken.token,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser(_id, { token: null });

  res.sendStatus(204);
};

const getCurrent = (req, res) => {
  const user = req.user;
  res.json({
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      avatarURL: user.avatarURL,
      dailyNorma: user.dailyNorma,
    },
    token: user.token,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "No attached file");
  }
  const { path } = req.file;

  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "avatars",
  });
  await fs.unlink(path);

  await authServices.updateUser({ _id }, { avatarURL });

  res.json({ avatarURL });
};

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const { dailyNorma } = req.body;

  const updatedUser = await authServices.updateUser(
    _id,
    { dailyNorma: dailyNorma },
    { new: true }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }
  await updateDailyNorma({ owner: _id, dailyNorma });

  res.json({ dailyNorma: updatedUser.dailyNorma });
};

const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const { name, email, gender, password, newPassword } = req.body;

  let updatedUser;

  const user = await authServices.findUser({ _id });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const existedUser = await authServices.findUser({ email });
  if (existedUser && existedUser._id.toString() !== _id) {
    throw HttpError(400, "User with this email already exists");
    return;
  }

  if (!password && !newPassword) {
    updatedUser = await authServices.updateUser(_id, {
      name,
      email,
      gender,
    });
  }

  if (password && newPassword) {
    const isValidPassword = await authServices.validatePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw HttpError(401, "Your password is wrong");
    }
    updatedUser = await authServices.updateUser(_id, {
      name,
      email,
      gender,
      password: await bcrypt.hash(newPassword, 10),
    });
  }

  console.log(updatedUser);
  res.json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateWaterRate: ctrlWrapper(updateWaterRate),
  updateProfile: ctrlWrapper(updateProfile),
};
