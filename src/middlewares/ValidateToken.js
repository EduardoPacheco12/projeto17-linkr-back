import { tokenMatch } from "../handlers/tokenHandler.js";
import jwt from "jsonwebtoken";

function validateToken(req, res, next) {
  const { authorization } = req.headers;

  const userId = tokenMatch(authorization);

  if(!userId) return res.sendStatus(401);

  res.locals.userId = userId;

  next();
}

export default validateToken;