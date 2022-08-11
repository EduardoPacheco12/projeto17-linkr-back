import { postsMetadata } from '../handlers/postsHandler.js';
import {postRepository} from '../repositories/postRepository.js'


export async function post(req, res) {
  const { link, description } = req.body;
  const {id} = res.locals
  try {
    await postRepository.sendPost(id, description, link);

    res.sendStatus(201);
  } catch(err) {
    console.log(err);
    res.sendStatus(401);
  }
}


export async function getPost(req, res) {

  try {
    const { rows: usersData } = await postRepository.getPosts();


    const item = await postsMetadata(usersData);
    res.status(200).send(item);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getPostUser(req, res) {
  const { userid } = req.params;

  try {
    const { rows:userData } = await postRepository.getPostUserId(userid);

    if(userData.length === 0) return res.sendStatus(404);

    const userPostMetadata = await postsMetadata(userData);

    res.status(200).send(userPostMetadata);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}