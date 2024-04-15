import Joi from "joi";
import { dateRegexp } from "../constants/user-constants.js";

const waterSchemas = Joi.object({
  waterVolume: Joi.number()
    .min(1)
    .max(5000)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.string()
    .regex(dateRegexp)
    .required()
    .messages({ "any.required": "missing required time field" }),
});

const updateWaterSchemas = Joi.object({
  waterVolume: Joi.number()
    .min(1)
    .max(5000)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.string()
    .regex(dateRegexp)
    .required()
    .messages({ "any.required": "missing required time field" }),
  id: Joi.string()
    .required()
    .messages({ "any.required": "missing required id field" }),
});

const schemas = {
  waterSchemas,
  updateWaterSchemas,
};
module.exports = { schemas };
