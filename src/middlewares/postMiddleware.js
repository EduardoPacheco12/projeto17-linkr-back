import { tokenMatch } from "../handlers/tokenHandler.js";
import { postSchema } from "../schemas/authSchemas.js";

export async function PostMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const user_id = tokenMatch(token)[1]

  const body = req.body;

  const { error } = postSchema.validate(body, { abortEarly: false });
  if(!tokenMatch(token)) {
    return res.sendStatus(401)
  }
  
  if (error) {
      return res.status(422).send(error.details);
  }
  res.locals.id = user_id;
  next();
}