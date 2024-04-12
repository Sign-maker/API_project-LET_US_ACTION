import Joi from "joi";

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({ "object.min": "Body must have at least one field" });

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
};
