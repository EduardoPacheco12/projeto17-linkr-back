import { tokenMatch } from "../handlers/tokenHandler.js";
import jwt from "jsonwebtoken";

function validateToken(req, res, next) {
  const { authorization } = req.headers;

  const isValidToken = tokenMatch(authorization);

  if(!isValidToken) return res.sendStatus(401);

  next();
}

export default validateToken;