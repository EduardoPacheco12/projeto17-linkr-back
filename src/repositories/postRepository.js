import connection from "../databases/postgres.js";

async function getPosts() {
	return connection.query('SELECT * FROM posts');
}

async function sendPost(id, description, url) {
	return connection.query('INSERT INTO posts ("creatorId", description, url) VALUES ($1, $2, $3)',[id, description, url]);
}

export const postRepository = {
    getPosts,
    sendPost
}