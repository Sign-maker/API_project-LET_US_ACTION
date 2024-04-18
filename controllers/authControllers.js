import jwt from "jsonwebtoken";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import * as authServices from "../services/authServices.js";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs/promises";

import Jimp from "jimp";
import { AVATAR_IMG_SIZES } from "../constants/user-constants.js";
import { updateDailyNorma } from "../services/waterServices.js";

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

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

  // const avatarURL = gravatar.url(req.body.email, { s: 250, d: "mp" });

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

const updateUser = async (req, res) => {
  const { _id } = req.user;
  //добавить проверку старого пароля при замене на новый и записи нового пароля в бд (с хеширование)
  const updatedUser = await authServices.updateUser(_id, req.body);

  res.json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      avatarURL: updatedUser.avatarURL,
      dailyNorma: updatedUser.dailyNorma,
    },
  });
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

const updateWaterRate = async (req, res) => {
  const { _id } = req.user;
  const { waterRate, dailyNorma } = req.body;

  if (waterRate > 15000) {
    throw HttpError(400, "The daily rate can be a maximum of 15 l");
  }

  const updatedUser = await updateUser(_id, { dailyNorma }, { new: true });

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  const norma = await updateDailyNorma({ owner: _id, dailyNorma });
  if (!norma) {
    throw HttpError(404);
  }

  res.json({ waterRate });
};

const updateProfile = async (req, res) => {
  console.log(req.body);
  const { _id } = req.user;
  const { name, email, gender, password, newPassword } = req.body;

  let updatedUser;

  const user = await authServices.findUser({ _id });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const existedUser = await authServices.findUser({ email });
  if (existedUser && existedUser._id.toString() !== _id) {
    throw HttpError(400, "Email already exists");
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
      throw HttpError(401, "Password is wrong");
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
  updateUser: ctrlWrapper(updateUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateWaterRate: ctrlWrapper(updateWaterRate),
  updateProfile: ctrlWrapper(updateProfile),
};
