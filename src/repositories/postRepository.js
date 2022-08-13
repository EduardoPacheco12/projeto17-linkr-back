import connection from "../databases/postgres.js";

async function getPosts() {
	return connection.query(
    `SELECT 
      p.id, p.url, p.description, u.username, u."pictureUrl", p."creatorId", COUNT(reactions."postId") as likes
      FROM posts p
      JOIN users u ON p."creatorId" = u.id
      LEFT JOIN reactions ON reactions."postId" = p.id
      GROUP BY p.id, u.id
      ORDER BY p.timestamp DESC
      LIMIT 20
    ;`
  );
}
// t."trendId" "trendIds"

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
    posts.*
    FROM users
    LEFT JOIN posts
    ON users.id = posts."creatorId"
    WHERE users.id = $1
    GROUP BY users.id, posts.id
    ORDER BY posts.id DESC;
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

export const postRepository = {
    getPosts,
    sendPost,
    getPostUserId,
    deletePost,
    verifyId,
    veridfyPostUser
}