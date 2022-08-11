import { postsMetadata } from '../handlers/postsHandler.js';
import {postRepository} from '../repositories/postRepository.js'


async function getMetadata(posts) {
  const postsWithMetadata = [];

  for(const post of posts) {
    postsWithMetadata.push(await postsMetadata(post));
  }

  return postsWithMetadata;
}

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
  let a = []
  try {
    const { rows: usersData, rowCount } = await postRepository.getPosts();

    const ultimos20 = (rowCount > 20)? 20 : rowCount; 
    for (let i = 0; i < rowCount; i++) {
      console.log(usersData[i])
      a.push( await postsMetadata(usersData[i]));
      
    }

    res.status(200).send(a.reverse());
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

    const userPostMetadata = await getMetadata(userData);

    res.status(200).send(userPostMetadata);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}