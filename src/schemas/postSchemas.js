import joi from "joi";

export const commentSchema = joi.object({
  text: joi.string().required()
})