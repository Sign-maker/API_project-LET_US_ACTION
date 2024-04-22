import Joi from "joi";
import { waterLimits } from "../constants/water-constants.js";

const waterSchema = Joi.object({
  waterVolume: Joi.number()
    .min(waterLimits.MIN_ONE_TIME_WATER_VALUE)
    .max(waterLimits.MAX_ONE_TIME_WATER_VALUE)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.date()
    .required()
    .messages({ "any.required": "missing required date field" }),
});

const updateWaterSchema = Joi.object({
  waterVolume: Joi.number()
    .min(waterLimits.MIN_ONE_TIME_WATER_VALUE)
    .max(waterLimits.MAX_ONE_TIME_WATER_VALUE)
    .required()
    .messages({ "any.required": "missing required waterVolume field" }),
  date: Joi.date()
    .required()
    .messages({ "any.required": "missing required date field" }),
});

const waterSchemas = {
  waterSchema,
  updateWaterSchema,
};
export default waterSchemas;
