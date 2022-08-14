import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.PRIVATE_KEY_JWT;

export function tokenHandler(credentials) {
  return jwt.sign({ email: credentials.email }, SECRET, { expiresIn: "720h" });
}

export function tokenMatch(authToken) {
  try {
    const token = authToken?.replace("Bearer ", "");
    const { id: userId } = jwt.verify(token, process.env.PRIVATE_KEY_JWT);
    return userId;
  } catch(err) {
    return false;
  }
}