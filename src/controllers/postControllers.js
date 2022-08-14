import getMetadados from '../handlers/postsHandler.js';
import postsMetadata from '../handlers/postsHandler.js';
import { setTrendingQuery, setTrendRelation } from '../repositories/contentRepository.js';
import { postRepository } from '../repositories/postRepository.js'


async function getMetadata(posts) {
  const postsWithMetadata = [];

  for(const post of posts) {
    const postMetadata = await postsMetadata(post.url);
    const {title, image, description, url} = postMetadata;
    postsWithMetadata.push(
      {...post, metadata:{title, image, description, url}}
    );
  }

  return postsWithMetadata;
}

export async function post(req, res) {
  const { link, description } = req.body;
  const { id } = res.locals;
  const queryData = [id, description, link]

  try {
    const { rows: response } = await postRepository.sendPost(queryData); 
    if(res.locals.trendsArray?.length > 0) {
      const trendData = res.locals.trendsArray;
      const { rows } = await setTrendingQuery(trendData);
      const tIds = rows.map(i => `${i['trendings']?.replaceAll(/\D/g, "")}`)
      await setTrendRelation(response[0]?.id, tIds);
    }
    const postInfo = { ...response[0]}
    res.status(201).send(postInfo);
    return;
  } catch(err) {
    res.sendStatus(401);
    return;
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

    let userPostMetadata;

    if(userData[0].url) {
      userPostMetadata = await getMetadata(userData);
    } else {
      userPostMetadata = userData;
    }

    res.status(200).send(userPostMetadata);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;
  try {
    await postRepository.deletePost(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updatePost(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  try {
    await postRepository.updatePost(id, description);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}