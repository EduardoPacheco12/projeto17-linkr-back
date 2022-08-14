import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.PRIVATE_KEY_JWT;

export function tokenHandler(credentials) {
  return jwt.sign({ email: credentials.email }, SECRET, { expiresIn: "720h" });
}

export function tokenMatch(authToken) {
  try {
    const token = authToken?.replace("Bearer ", "");
    if (token && jwt.verify(token, SECRET)) {
      const id = Object.entries(jwt.verify(token, SECRET))[0];
      return id;
    }
    return true;
  } catch (err) {
    return false;
  }
}