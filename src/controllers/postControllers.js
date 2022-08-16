import getMetadados from '../handlers/postsHandler.js';
import postsMetadata from '../handlers/postsHandler.js';
import { setTrendingQuery, setTrendRelation } from '../repositories/contentRepository.js';
import { postRepository } from '../repositories/postRepository.js'
import { trendsRepository } from '../repositories/trendsRepository.js';

async function registerTrend(trendName) {
  const { rows: registeredTrend } = await trendsRepository.getTrends(trendName);

  if(registeredTrend.length > 0) return;
  await trendsRepository.setNewTrend(trendName);
}

async function getTrendsPost(postId, trendsArray) {
  const { rows: trends } = await trendsRepository.getPostTrends(postId);

  const trendsToDelete = trends.filter(trend => trendsArray.indexOf(trend.name) === -1);
  trendsToDelete.forEach(async trend => await trendsRepository.deletePostTrend(trend.id));

  const filterNewtrands = trend => {
    for(let i = 0; i < trends.length; i++) {
      if(trend === trends[i].name) {
        return false;
      }
    }
  
    return true;
  }

  const trendsToAdd = trendsArray.filter(filterNewtrands);
  trendsToAdd.forEach(async trend => await registerTrend(trend));

  const trendsIdToAdd = [];
  for(const trendName of trendsToAdd) {
    const { rows:trendId } = await trendsRepository.getTrendId(trendName);
    trendsIdToAdd.push(trendId[0].id);
  };

  return trendsIdToAdd;
}

async function getMetadata(link) {
  let postsWithMetadata;

  try {
    const postMetadata = await postsMetadata(link);

    const {title, image, description, url} = postMetadata;
    postsWithMetadata = {title, image, description, url};
  } catch(err) {
    postsWithMetadata = {title: "", image: "", description: "", url: ""};
  }

  return postsWithMetadata;
}

export async function post(req, res) {
  const { link, description: post } = req.body;
  const { id } = res.locals;
  let queryData;

  try {
    const { rows: registeredMetadata } = await postRepository.getMetadata(link);

    if(registeredMetadata.length === 0) {
      const postMetadata = await getMetadata(link);
      const { title, description: descriptionMetadata, image }  = postMetadata;
  
      await postRepository.setPostMetadata(title, descriptionMetadata, image, link);
  
      const { rows: metadata } = await postRepository.getMetadata(link);
  
      queryData = [ id, post, metadata[0].id ];
    } else {
      queryData = [ id, post, registeredMetadata[0].id ];
    }

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
    res.sendStatus(500);
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
  const { trendsArray } = res.locals;

  try {
    const newTrendsId = await getTrendsPost( id, trendsArray );

    if(newTrendsId.length > 0) {
      newTrendsId.forEach(async trendId => await trendsRepository.setPostTrendRelation(id, trendId));
    }

    await postRepository.updatePost(id, description);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}