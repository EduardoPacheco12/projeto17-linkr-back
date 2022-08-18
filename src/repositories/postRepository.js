import connection from "../databases/postgres.js";

async function getPosts() {
	return connection.query(
    `SELECT 
    p.id, metadatas.url, p.post AS description, p."creatorId", 
    u.username, u."pictureUrl", 
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
    FROM posts p
    JOIN users u ON p."creatorId" = u.id
    JOIN metadatas ON p."metaId" = metadatas.id
    LEFT JOIN reactions ON reactions."postId" = p.id
    GROUP BY p.id, u.id,
    metadatas.url, metadatas.title, metadatas.image, metadatas.description
    ORDER BY p."postTime" DESC
    LIMIT 20
    ;`
  );
}

async function setPostMetadata(title, description, image, url) {
  return connection.query(
    `
    INSERT INTO metadatas ( title, description, image, url )
    VALUES ( $1, $2, $3, $4 );
    `,
    [ title, description, image, url ]
  );
}

async function getMetadata(url) {
  return connection.query(
    `
    SELECT * FROM metadatas
    WHERE url = $1;
    `,
    [ url ]
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

async function getPostUserId(userId) {
  return connection.query(
    `
    SELECT users.username, users."pictureUrl", users.id AS "creatorId",
    p.id, p.post AS description, metadatas.url,
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id ORDER BY "userId" ASC) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id ORDER BY users.id ASC) AS "nameWhoLiked",
    json_build_object(
      'title', metadatas.title,
      'image', metadatas.image,
      'description', metadatas.description,
      'url', metadatas.url
    ) AS metadata
    FROM users
    LEFT JOIN posts p
    ON users.id = p."creatorId"
    LEFT JOIN metadatas
    ON p."metaId" = metadatas.id
    LEFT JOIN reactions 
    ON reactions."postId" = p.id
    WHERE users.id = $1
    GROUP BY users.id, p.id,
    metadatas.url, metadatas.title, metadatas.image, metadatas.description
    ORDER BY p.id DESC
    LIMIT 20;
    `,
    [ userId ]
  );
}

async function deletePost(id) {
  return connection.query('DELETE FROM posts WHERE id = $1', [id]);
}

async function verifyId(id) {
  return connection.query('SELECT * FROM posts WHERE id = $1', [id]);
}

async function veridfyPostUser(id, userId) {
  return connection.query('SELECT * FROM posts WHERE posts.id = $1 AND posts."creatorId" = $2',[Number(id), userId])
}

async function updatePost(id, description) {
  return connection.query('UPDATE posts SET post = $1 WHERE id = $2', [description, Number(id)])
}

export const postRepository = {
    getPosts,
    setPostMetadata,
    getMetadata,
    sendPost,
    getPostUserId,
    deletePost,
    verifyId,
    veridfyPostUser,
    updatePost
}