import { signInSchema, signUpSchema } from "../schemas/authSchemas.js";
import { authRepository } from "../repositories/authRepository.js";
import bcrypt from "bcrypt";

export async function SignUpMiddleware(req, res, next) {
    const body = req.body;

    const { error } = signUpSchema.validate(body, { abortEarly: false });
    if(error) {
        return res.status(422).send(error.details);
    }

    const { rows: verifyEmail } = await authRepository.SignMiddleware(body.email);
    if(verifyEmail[0]) {
        return res.sendStatus(409);
    }

    next();
}

export async function SignInMiddleware(req, res, next) {
  const body = req.body;

  const { error } = signInSchema.validate(body, { abortEarly: false });
  if (error) {
      return res.status(422).send(error.details);
  }

  const { rows: verifyUser } = await authRepository.SignMiddleware(body.email);
  if(!verifyUser[0]) {
      return res.sendStatus(401);
  }

  const verifyPassword = bcrypt.compareSync(body.password, verifyUser[0].password);
  if(!verifyPassword) {
      return res.sendStatus(401);
  }

  res.locals.id = verifyUser[0].id
  res.locals.pictureUrl = verifyUser[0].pictureUrl;

  next();
}