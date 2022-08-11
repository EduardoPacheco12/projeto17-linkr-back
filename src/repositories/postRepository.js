import connection from "../databases/postgres.js";

async function getPosts() {
	return connection.query('SELECT users.username, users."pictureUrl", posts.*  FROM posts JOIN users ON users.id="creatorId"');
}

async function sendPost(id, description, url) {
	return connection.query('INSERT INTO posts ("creatorId", description, url) VALUES ($1, $2, $3)',[id, description, url]);
}

async function getPostUserId(userId) {
  return connection.query(
    `
    SELECT users.id, users.username, users."pictureUrl",
    posts.id, posts.url, posts.description
    FROM users
    LEFT JOIN posts
    ON users.id = posts."creatorId"
    WHERE users.id = $1
    GROUP BY users.id, posts.id;
    `,
    [ userId ]
  );
}

export const postRepository = {
    getPosts,
    sendPost,
    getPostUserId
}