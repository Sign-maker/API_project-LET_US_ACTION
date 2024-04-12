import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const password = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, password });
};

export const validatePassword = async (password, hashPassword) =>
  await bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) =>
  User.findByIdAndUpdate(filter, data);
