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