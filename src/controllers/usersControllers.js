import { tokenMatch } from "../handlers/tokenHandler.js";
import { getUserByName, returnPictureUser } from "../repositories/usersRepository.js";

export async function searchUser(req, res) {
  const { name } = req.query;

  try {
    const { rows: usersData } = await getUserByName(name);

    res.status(200).send(usersData);
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function userPicture(req, res) {
  const user_id = tokenMatch(req.headers.authorization)[1]

  if(!user_id){return res.sendStatus(401)}

  try {
    const { rows:{[0]:usersData} , rowCount} = await returnPictureUser(user_id);

    if(rowCount === 0){return res.sendStatus(404)}

    res.status(200).send(usersData);
  } catch(err) {
    res.sendStatus(500);
  }
}