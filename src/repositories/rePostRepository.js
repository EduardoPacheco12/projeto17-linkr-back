import connection from "../databases/postgres.js";

async function getAllRePost() {
  return connection.query(`
  SELECT 
    sh."userId" as "reposterId",
	us.username as "reposterName", p.id, metadatas.url, p.post AS description, p."creatorId", 
    u.username, u."pictureUrl", 
    COUNT(reactions."postId") AS likes,
    COUNT(comments."postId") AS comments,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata, sh."shareTime" as "postTime"
    FROM posts p
    JOIN users u ON p."creatorId" = u.id
    JOIN metadatas ON p."metaId" = metadatas.id
	LEFT JOIN shares sh ON sh."postId" = p.id
    LEFT JOIN reactions ON reactions."postId" = p.id
	JOIN users us ON us.id = sh."userId"
    LEFT JOIN comments ON comments."postId" = p.id
    GROUP BY p.id, u.id, sh.id, us.id,
    metadatas.url, metadatas.title, metadatas.image, metadatas.description
    ORDER BY "postTime" DESC
    LIMIT 20
  ;`)
}

async function countRePost(postId, userId) {
  return connection.query(`
  SELECT (SELECT EXISTS (SELECT * FROM shares WHERE "postId"=$1 AND "userId"=$2) as shared),
  COUNT("postId")
  FROM shares
  WHERE "postId"=$1;
  `, [postId, userId]);
}

async function insertRePost(postId,userId) {
  return connection.query(`
    INSERT INTO shares ("postId", "userId")
    VALUES ($1,$2)
  `, [postId, userId]);
}

async function checkRePost(postId,userId) {
  return connection.query(`
    SELECT * FROM shares 
    WHERE "postId"=$1 AND "userId"=$2
  `, [postId, userId]);
}

async function deleteRePost(postId,userId) {
  return connection.query(`
    DELETE FROM shares
    WHERE "postId"=$1 AND "userId"=$2
  `, [postId, userId]);
}

export const rePostRepository = {
  countRePost,
  insertRePost,
  checkRePost,
  deleteRePost,
  getAllRePost
}