import getMetadados from '../handlers/postsHandler.js';
import postsMetadata from '../handlers/postsHandler.js';
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

  console.log(res.locals)
  try {
    await postRepository.sendPost(id, description, link); 

    res.sendStatus(201);
  } catch(err) {
    res.sendStatus(401);
  }
}


export async function getPost(req, res) {
  let posts = []
  try {
    const { rows: allPosts } = await postRepository.getPosts();

    for(let post of allPosts){
      try{

        const metadata = await getMetadados(post.url);
        const {title, image, description, url} = metadata;
        posts.push({...post, metadata:{title, image, description, url}})
      }catch (error) {
        const metadata = { title: "", image: "", description: "" }
        const {title, image, description, url} = metadata;
        posts.push({...post, metadata:{title, image, description, url}})
      }
    }

    res.status(200).send(posts);
  } catch(err) {
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
    res.sendStatus(500);
  }
}