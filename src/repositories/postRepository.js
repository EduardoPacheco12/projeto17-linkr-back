import connection from "../databases/postgres.js";

async function getPosts() {
	return connection.query(
    `SELECT 
    p.id, p.url, p.description, p."creatorId", 
    u.username, u."pictureUrl", 
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id) AS "usersWhoLiked" ,
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id) AS "nameWhoLiked"
    FROM posts p
    JOIN users u ON p."creatorId" = u.id
    LEFT JOIN reactions ON reactions."postId" = p.id
    GROUP BY p.id, u.id
    ORDER BY p.timestamp DESC
    LIMIT 20
    ;`
  );
}

async function sendPost(queryData) {
  const queryString = `
    INSERT INTO posts 
    ("creatorId", description, url) 
    VALUES ($1, $2, $3)
    RETURNING id, "creatorId", description, url;
  ;`;

	return connection.query(queryString, queryData);
}

async function getPostUserId(userId) {
  return connection.query(
    `
    SELECT users.username, users."pictureUrl",
    p.*,
    COUNT(reactions."postId") AS likes,
    ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id) AS "usersWhoLiked",
    ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id) AS "nameWhoLiked"
    FROM users
    LEFT JOIN posts p
    ON users.id = p."creatorId"
    LEFT JOIN reactions 
    ON reactions."postId" = p.id
    WHERE users.id = $1
    GROUP BY users.id, p.id
    ORDER BY p.id DESC;
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

async function  updatePost(id, description) {
  return connection.query('UPDATE posts SET description = $1 WHERE id = $2', [description, Number(id)])
}

export const postRepository = {
    getPosts,
    sendPost,
    getPostUserId,
    deletePost,
    verifyId,
    veridfyPostUser,
    updatePost
}