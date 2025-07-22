import Joi from "joi";

export const searchNoteSchema = Joi.object({
  title: Joi.string().allow(null, ""),
  startDate: Joi.string().allow(null, ""),
  endDate: Joi.string().allow(null, ""),
  customerId: Joi.string().required(),
});

export const createNoteSchema = Joi.object({
  customerId: Joi.string().required(),
  project: Joi.string().required(),
  title: Joi.string().required(),
  date: Joi.string().required(),
  attendees: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .required(),
  noteExpand: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().allow(null, ""),
        description: Joi.string().required(),
        conclude: Joi.string().allow(null, ""),
      })
    )
    .required(),
  noteAttachment: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
      })
    )
    .allow(null)
    .default([]),
});
export const updateNoteSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  date: Joi.string().required(),
  attendees: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .required(),
  noteExpand: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().allow(null, ""),
        description: Joi.string().required(),
        conclude: Joi.string().required(),
      })
    )
    .required(),
  noteAttachment: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().required(),
      })
    )
    .allow(null)
    .default([]),
});
