import { getUserByName } from "../repositories/usersRepository.js";

export async function searchUser(req, res) {
  const { name } = req.query;

  try {
    const { rows: usersData } = await getUserByName(name);

    res.status(200).send(usersData);
  } catch(err) {
    res.sendStatus(500);
  }
}