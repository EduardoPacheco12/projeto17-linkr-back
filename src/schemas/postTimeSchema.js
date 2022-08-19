import joi from "joi";

const postTimeSchema = joi.object(
  {
    lastPostTime: joi.date().required(),
  }
)

export default postTimeSchema;