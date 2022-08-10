import {postRepository} from '../repositories/postRepository.js'


export async function post(req, res) {
  const { link } = req.query;

  try {
    const { rows: usersData } = await postRepository.sendPost(link);

    res.status(200).send(usersData);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}


export async function getPosts(req, res) {
  const { name } = req.query;

  try {
    const { rows: usersData } = await getUserByName(name);

    res.status(200).send(usersData);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}