import connection from "../databases/postgres.js";

async function getPosts(page, userId) {
  const queryParams = [page, userId];
  const queryString = `
  SELECT 
    p.id, p."creatorId", p.post description, p."postTime", NULL AS "reposterId", NULL AS "reposterName",
    us.username, us."pictureUrl", 
    COUNT(p.id) OVER() "tableLength",
    COALESCE(COUNT(distinct(reactions.id)), 0) AS likes,
    COALESCE(COUNT(distinct(comments.id)), 0) AS comments,
    COALESCE(COUNT(distinct(shares.id)), 0) AS shares,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
  FROM posts p
  JOIN metadatas ON p."metaId" = metadatas.id
  JOIN users us ON p."creatorId" = us.id
  LEFT OUTER JOIN shares ON shares."postId" = p.id
  LEFT OUTER JOIN relations ON relations."followed" = us.id OR relations.follower = us.id
  LEFT OUTER JOIN comments ON comments."postId" = p.id
  LEFT OUTER JOIN reactions ON reactions."postId" = p.id
  WHERE relations.follower = $2 OR p."creatorId" = $2
  GROUP BY p.id, 
  metadatas.id,
  us.username, us."pictureUrl"
  UNION ALL
  SELECT 
    "sharedPosts".id, "sharedPosts"."creatorId",
    "sharedPosts".post description, shares."shareTime" AS "postTime", 
    shares."userId" AS "reposterId", us.username as "reposterName", 
    us.username, us."pictureUrl", 
    COUNT("sharedPosts".id) OVER() "tableLength",
    COALESCE(COUNT(distinct(reactions.id)), 0) AS likes,
    COALESCE(COUNT(distinct(comments.id)), 0) AS comments,
    COALESCE(COUNT(distinct(shares.id)), 0) AS shares,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"="sharedPosts".id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"="sharedPosts".id ORDER BY users.id ASC) AS "nameWhoLiked",
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
  FROM posts "sharedPosts"
  JOIN users us ON "sharedPosts"."creatorId" = us.id
  JOIN metadatas ON "sharedPosts"."metaId" = metadatas.id
  LEFT OUTER JOIN shares ON shares."postId" = "sharedPosts".id
  LEFT OUTER JOIN relations ON relations."followed" = shares."userId" OR relations.follower = shares."userId"
  LEFT OUTER JOIN comments ON comments."postId" = "sharedPosts".id
  LEFT OUTER JOIN reactions ON reactions."postId" = "sharedPosts".id
  WHERE relations.follower = $2 OR shares."userId" = $2
  GROUP BY "sharedPosts".id, shares."shareTime", shares."userId", 
  metadatas.title, metadatas.image, metadatas.description, metadatas.url,
  us.username, us."pictureUrl"
  ORDER BY "postTime" DESC
  OFFSET 10*($1-1)
  LIMIT 10;
  ;`;
  return connection.query(queryString, queryParams);
}

async function setPostMetadata(title, description, image, url) {
  return connection.query(
    `
    INSERT INTO metadatas ( title, description, image, url )
    VALUES ( $1, $2, $3, $4 );
    `,
    [title, description, image, url]
  );
}

async function getMetadata(url) {
  return connection.query(
    `
    SELECT * FROM metadatas
    WHERE url = $1;
    `,
    [url]
  );
}

async function sendPost(queryData) {
  const queryString = `
    INSERT INTO posts 
    ("creatorId", post, "metaId") 
    VALUES ($1, $2, $3)
    RETURNING id, "creatorId", post, "metaId"
  ;`;

  return connection.query(queryString, queryData);
}

async function getPostUserId(userId, page) {
  const queryParams = [userId, page];
  const queryString = `
  SELECT 
  p.id, p."creatorId", p.post description, p."postTime",
  us.id "userId", us.username, us."pictureUrl", 
  COUNT(p.id) OVER() "tableLength", 
  COALESCE(COUNT(distinct(reactions.id)), 0) AS likes, 
  COALESCE(COUNT(distinct(comments.id)), 0) AS comments,
  COALESCE(COUNT(distinct(shares.id)), 0) AS shares,
  ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
  ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
  json_build_object( 
    'title', metadatas.title, 
    'image', metadatas.image, 
    'description', metadatas.description, 
    'url', metadatas.url 
  ) AS metadata 
  FROM posts p 
  FULL OUTER JOIN metadatas ON p."metaId" = metadatas.id 
  FULL OUTER JOIN users us ON p."creatorId" = us.id 
  FULL OUTER JOIN comments ON comments."postId" = p.id 
  FULL OUTER JOIN reactions ON reactions."postId" = p.id 
  FULL OUTER JOIN shares ON shares."postId" = p.id 
  WHERE us.id=$1 
  GROUP BY us.id, p.id, metadatas.id 
  OFFSET 10*($2-1) 
  LIMIT 10
  ;`;
  return connection.query(queryString, queryParams);
}

async function deletePost(id) {
  return connection.query("DELETE FROM posts WHERE id = $1", [id]);
}

async function verifyPostUser(id, userId) {
  return connection.query(
    'SELECT * FROM posts WHERE posts.id = $1 AND posts."creatorId" = $2',
    [Number(id), userId]
  );
}

async function verifyPost(postId) {
  return connection.query("SELECT * FROM posts WHERE id = $1", [postId]);
}

async function updatePost(id, description) {
  return connection.query("UPDATE posts SET post = $1 WHERE id = $2", [
    description,
    Number(id),
  ]);
}

async function getComments(userId, postId) {
  const queryString = `
  SELECT 
  users.username AS user, 
  users.id as "userId", users."pictureUrl" as "pictureUser", 
  posts."creatorId" as "creatorPostId", 
  comments.text as text, comments."commentTime" as "commentTime", 
  ARRAY (SELECT followed FROM relations WHERE $1 = follower) AS follows 
  FROM comments 
  JOIN users 
  ON comments."creatorId" = users.id
  JOIN posts
  ON comments."postId" = posts.id
  WHERE comments."postId" = $2
  ORDER BY "commentTime" ASC
  ;`;
  return connection.query(queryString, [userId, postId]);
}

async function postComment(text, creatorId, postId) {
  return connection.query(
    'INSERT INTO comments (text, "creatorId", "postId") VALUES ($1, $2, $3)',
    [text, creatorId, postId]
  );
}

async function getNewPosts(userId, lastPostTime) {
  return connection.query(
    `
    SELECT 
    p.id, p."creatorId", p.post AS description, p."postTime", NULL AS "reposterId", NULL AS "reposterName",
    us.username, us."pictureUrl", 
    COUNT(p.id) OVER() "tableLength",
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
    COUNT(comments."postId") AS comments,
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
  FROM posts p
  JOIN metadatas ON p."metaId" = metadatas.id
  JOIN users us ON p."creatorId" = us.id
  RIGHT JOIN relations ON relations."followed" = us.id OR relations.follower = us.id
  LEFT JOIN comments ON comments."postId" = p.id
  LEFT JOIN reactions ON reactions."postId" = p.id
  WHERE (relations.follower = $1 OR p."creatorId" = $1) AND "postTime" > $2
  GROUP BY p.id, 
  metadatas.id,
  us.username, us."pictureUrl"
  UNION ALL
  SELECT 
    "sharedPosts".id,"sharedPosts"."creatorId",
	"sharedPosts".post AS description, 
    shares."shareTime" AS "postTime", 
    shares."userId" AS "reposterId", us.username as "reposterName", 
    us.username, us."pictureUrl", 
    COUNT("sharedPosts".id) OVER() "tableLength",
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"="sharedPosts".id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"="sharedPosts".id ORDER BY users.id ASC) AS "nameWhoLiked",
    COUNT(comments."postId") AS comments,
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
  FROM posts "sharedPosts"
  JOIN users us ON "sharedPosts"."creatorId" = us.id
  JOIN shares ON shares."postId" = "sharedPosts".id
  JOIN metadatas ON "sharedPosts"."metaId" = metadatas.id
  JOIN relations ON relations."followed" = shares."userId" OR relations.follower = shares."userId"
  LEFT JOIN comments ON comments."postId" = "sharedPosts".id
  LEFT JOIN reactions ON reactions."postId" = "sharedPosts".id
  WHERE (relations.follower = $1 OR shares."userId" = $1) AND shares."shareTime" > $2
  GROUP BY "sharedPosts".id, shares."shareTime", shares."userId", 
  metadatas.title, metadatas.image, metadatas.description, metadatas.url,
  us.username, us."pictureUrl"
  ORDER BY "postTime" DESC;
  `,
  [ userId, lastPostTime]
  )
}

export const postRepository = {
  getPosts,
  setPostMetadata,
  getMetadata,
  sendPost,
  getPostUserId,
  deletePost,
  verifyPostUser,
  verifyPost,
  updatePost,
  getComments,
  postComment,
  getNewPosts
};
