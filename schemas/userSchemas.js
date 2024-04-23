import Joi from "joi";
import { emailRegexp, genderList } from "../constants/user-constants.js";
import { waterLimits } from "../constants/water-constants.js";

const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(8).max(64).required(),
});

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  password: Joi.string().min(8).max(64).required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().max(32),
  email: Joi.string().pattern(emailRegexp).message({
    "string.pattern.base": "The email must be in format test@gmail.com.",
  }),
  gender: Joi.string().valid(...genderList),
  password: Joi.string().min(8).max(64),
  newPassword: Joi.string().min(8).max(64),
  dailyNorma: Joi.number().min(0).max(15),
});

const waterRateSchema = Joi.object({
  dailyNorma: Joi.number()
    .required()
    .min(1)
    .max(waterLimits.MAX_DAILY_WATER_VALUE)
    .message({ "any.required": "missing required dailyNorma field" }),
});

export default {
  userSignUpSchema,
  userSignInSchema,
  userUpdateSchema,
  waterRateSchema,
};
