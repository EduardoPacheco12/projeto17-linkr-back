import { tokenMatch } from "../handlers/tokenHandler.js";
import { postRepository } from "../repositories/postRepository.js";
import { postSchema } from "../schemas/authSchemas.js";
import { commentSchema } from "../schemas/postSchemas.js";

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

  const { rows: verifyPostId } = await postRepository.verifyPost(id);
    if(!verifyPostId[0]) {
        return res.sendStatus(404);
    }

  const { rows: verifyPostUser } = await postRepository.verifyPostUser(id, userId);
  if(!verifyPostUser[0]) {
      return res.sendStatus(401);
  }

  next();

}

export async function getCommentsMiddleware(req, res, next) {
  const { postId } = req.params;

  const { rows: verifyPost } = await postRepository.verifyPost(postId);
    if(!verifyPost[0]) {
      return res.sendStatus(404);
    }

  next();
}

export async function postCommentMiddleware(req, res, next) {
  const body = req.body;
  const { postId } = req.params;

  const { error } = commentSchema.validate(body, { abortEarly: false });
  if(error) {
    return res.status(422).send(error.details);
  }

  const { rows: verifyPost } = await postRepository.verifyPost(postId);
    if(!verifyPost[0]) {
      return res.sendStatus(404);
    }

  next();
}