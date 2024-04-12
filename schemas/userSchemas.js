import Joi from "joi";
import { emailRegexp, subscriptionList } from "../constants/user-constants.js";

const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userSignInSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

export default {
  userSignUpSchema,
  userSignInSchema,
  userUpdateSubscriptionSchema,
};
