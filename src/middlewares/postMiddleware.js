import { tokenMatch } from "../handlers/tokenHandler.js";
import { postSchema } from "../schemas/authSchemas.js";

export async function PostMiddleware(req, res, next) {

  console.log(tokenMatch(req.headers.authorization))

  const body = req.body;

  const { error } = postSchema.validate(body, { abortEarly: false });
  if (error) {
      return res.status(422).send(error.details);
  }

  next();
}