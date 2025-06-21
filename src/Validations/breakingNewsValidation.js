import Joi from "joi";

export const breakingNewsSchema = Joi.object({
  headline: Joi.string().trim().required(),
  category: Joi.string().required(),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  startDateAndTime: Joi.date().required(),
  endDateAndTime: Joi.date().required(),
  link: Joi.string().uri().optional().allow(""),
  setActiveImmediately: Joi.boolean().default(false),

  displayOptions: Joi.object({
    showCategory: Joi.boolean().default(true),
    flashHighPriority: Joi.boolean().default(false),
    authorize: Joi.boolean().default(false),
  }),
});

export const tickerSettingSchema = Joi.object({
  speed: Joi.string().valid("slow", "medium", "fast").default("medium"),
  showCategory: Joi.boolean().default(false),
  flashHighPriority: Joi.boolean().default(false),
  autoRotate: Joi.boolean().default(false),
});
