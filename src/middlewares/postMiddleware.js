import { tokenMatch } from "../handlers/tokenHandler";
import { postSchema } from "../schemas/authSchemas";

export async function PostMiddleware(req, res, next) {

  console.log(tokenMatch(req.headers.authorization))

  const body = req.body;

  const { error } = postSchema.validate(body, { abortEarly: false });
  if (error) {
      return res.status(422).send(error.details);
  }

  next();
}