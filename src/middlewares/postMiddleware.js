import { postSchema } from "../schemas/authSchemas";

export async function PostMiddleware(req, res, next) {
  const body = req.body;

  const { error } = postSchema.validate(body, { abortEarly: false });
  if (error) {
      return res.status(422).send(error.details);
  }

  next();
}