import connection from "../databases/postgres.js";

async function getPosts(email) {
	return connection.query('SELECT * FROM posts');
}

async function Post(id, post, url) {
	return connection.query('INSERT INTO posts (creatorId, post, url) VALUES ($1, $2, $3)',[id, post, url]);
}

export const postRepository = {
    getPosts,
    Post
}