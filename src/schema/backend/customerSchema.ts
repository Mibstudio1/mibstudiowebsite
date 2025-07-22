import Joi from "joi";

export const loginSchema = Joi.object({
  customerId: Joi.string().required(),
});

export const registorSchema = Joi.object({
  customerName: Joi.string().required(),
  companyName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

export const editSchema = Joi.object({
  customerName: Joi.string().required(),
  companyName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  customerId: Joi.string().required(),
});
