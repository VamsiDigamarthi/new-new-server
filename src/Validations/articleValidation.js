import Joi from "joi";

export const articleSchema = Joi.object({
  headline: Joi.string().min(3).max(200).required(),
  subHeading: Joi.string().min(3).max(300).required(),
  content: Joi.string().min(10).required(),
  author: Joi.string().required(), // should be ObjectId string
  category: Joi.string().required(),
  publishedDate: Joi.string().required(), // could also validate format with regex
  image: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid("draft", "published").default("draft"),
});
