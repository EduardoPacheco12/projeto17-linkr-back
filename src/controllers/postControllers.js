import postsMetadata from '../handlers/postsHandler.js';
import { setTrendingQuery, setTrendRelation } from '../repositories/contentRepository.js';
import { postRepository } from '../repositories/postRepository.js';
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
  const { userId } = res.locals;
  const page = req.query.page
  try {
    const { rows: response } = await postRepository.getPosts(page, userId);
    const lengths = [...new Set(response.map(p => p.tableLength))]
    if(lengths.length === 1) {
      response.map(p => p.tableLength = 2*lengths[0])
    } else {
      const newTableLength = lengths.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue), 0);
      response.map(p => p.tableLength = newTableLength)
    }
    res.status(200).send(response);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getPostUser(req, res) {
  const { userid } = req.params;
  const page = req.query.page

  try {
    const { rows:userData } = await postRepository.getPostUserId(userid, page);

    const lengths = [...new Set(userData.map(p => p.tableLength))]
    if(lengths.length === 1) {
      userData.map(p => p.tableLength = 2*lengths[0])
    } else {
      const newTableLength = lengths.reduce((previousValue, currentValue) => Number(previousValue) + Number(currentValue), 0);
      userData.map(p => p.tableLength = newTableLength)
    }

    res.status(200).send(userData);
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
      newTrendsId.forEach(async trendId => {
        await trendsRepository.setPostTrendRelation(id, trendId)
      });
    }

    await postRepository.updatePost(id, description);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getComments(req, res) {
  const userId = res.locals.userId;
  const { postId } = req.params;

  try {
    const { rows: comments } = await postRepository.getComments(postId);
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function postComments(req, res) {
  const userId = res.locals.userId;
  const { postId } = req.params;
  const { text } = req.body;
  try {
    await postRepository.postComment(text, userId, postId);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error);
  }
}