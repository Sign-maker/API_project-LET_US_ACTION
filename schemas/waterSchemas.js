import Joi from "joi";
import { dateRegexp } from "../constants/user-constants.js";
import { minWaterCount, maxWaterCount } from "../constants/water-constants.js";

const waterSchema = Joi.object({
  waterVolume: Joi.number()
    .min(minWaterCount)
    .max(maxWaterCount)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.string()
    .regex(dateRegexp)
    .required()
    .messages({ "any.required": "missing required date field" }),
});

const updateWaterSchema = Joi.object({
  waterVolume: Joi.number()
    .min(minWaterCount)
    .max(maxWaterCount)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.string()
    .regex(dateRegexp)
    .required()
    .messages({ "any.required": "missing required date field" }),
});

const waterSchemas = {
  waterSchema,
  updateWaterSchema,
};
export default waterSchemas;
