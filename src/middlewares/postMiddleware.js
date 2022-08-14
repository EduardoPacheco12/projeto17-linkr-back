import { tokenMatch } from "../handlers/tokenHandler.js";
import { postRepository } from "../repositories/postRepository.js";
import { postSchema } from "../schemas/authSchemas.js";

export async function PostMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const user_id = tokenMatch(token);

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

export async function deleteUpdatePostMiddleware(req, res, next) {
  const { id } = req.params;
  const userId = res.locals.userId;

  const { rows: verifyId } = await postRepository.verifyId(id);
    if(!verifyId[0]) {
        return res.sendStatus(404);
    }

  const { rows: verifyPostUser } = await postRepository.veridfyPostUser(id, userId);
  if(!verifyPostUser[0]) {
      return res.sendStatus(401);
  }

  next();

}