import { getContentData, getTrendingQuery } from "../repositories/contentRepository.js";
import postsMetadata from '../handlers/postsHandler.js';

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


export async function redirectToHashtag(req, res) {
  try {
    const data = req.params;
    const { rows: response } = await getContentData(data.id)
    const postsWithMetadata = await getMetadata(response);
    res.status(200).send(postsWithMetadata);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send();
    return;
  }
}

export async function listTopTrends(req, res) {
  try {
    const { rows: response } = await getTrendingQuery()
    res.status(200).send(response);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).send();
    return;
  }
}