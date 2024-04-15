import Joi from "joi";
import { emailRegexp, genderList } from "../constants/user-constants.js";

const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().max(32),
  email: Joi.string().pattern(emailRegexp),
  oldPassword: Joi.string().min(8).max(64),
  password: Joi.string().min(8).max(64),
  gender: Joi.string().valid(...genderList),
  dailyNorma: Joi.number().min(0).max(15),
});

const waterRateSchema = Joi.object({
  dailyNorma: Joi.number()
    .required()
    .min(1)
    .max(15)
    .message({ "any.required": "missing required dailyNorma field" }),
});

export default {
  userSignUpSchema,
  userSignInSchema,
  userUpdateSchema,
  waterRateSchema,
};
