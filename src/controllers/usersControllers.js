import { tokenMatch } from "../handlers/tokenHandler.js";
import { usersRepository } from "../repositories/usersRepository.js";

export async function searchUser(req, res) {
  const { name } = req.query;

  try {
    const { rows: usersData } = await usersRepository.getUserByName(name);

    res.status(200).send(usersData);
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function userPicture(req, res) {
  const user_id = tokenMatch(req.headers.authorization)[1]

  if(!user_id){return res.sendStatus(401)}

  try {
    const { rows:{[0]:usersData} , rowCount} = await usersRepository.returnPictureUser(user_id);

    if(rowCount === 0){return res.sendStatus(404)}

    res.status(200).send(usersData);
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function followUnfollow(req, res) {
  const { userId } = res.locals;
  const { id: followedId } = req.params;

  try {
    const { rows: followRelation } = await usersRepository.searchFollowRelation(userId, followedId);
    
    let relationId;
    
    if(followRelation.length === 0) {
      await usersRepository.setFollowRelation(userId, followedId);
      const { rows: followRelation } = await usersRepository.searchFollowRelation(userId, followedId);

      relationId = followRelation[0].id;
    } else {
      await usersRepository.deleteFollowRelation(followRelation[0].id);
    }

    res.status(200).send({ relationId });
  } catch(err) {
    res.sendStatus(500);
  }
}

export async function getFollowRelation(req, res) {
  const { userId } = res.locals;
  const { id: followedId } = req.params;

  try {
    const { rows: followRelation } = await usersRepository.searchFollowRelation(userId, followedId);

    const relationId = followRelation[0] ? followRelation[0].id : undefined;

    res.status(200).send({ relationId });
  } catch(err) {
    res.sendStatus(500);
  }
}