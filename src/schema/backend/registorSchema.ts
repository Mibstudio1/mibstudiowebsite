import Joi from "joi";

export const registorSchema = Joi.object({
  customerName: Joi.string().required(),
  companyName: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});
