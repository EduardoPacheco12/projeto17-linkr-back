import bcrypt from "bcrypt";

export function passwordMatch(pw, encryptedPw) {
  const match = bcrypt.compareSync(pw, encryptedPw)
  if (match) {
    return true;
  }
  return false;
}