import connection from "../databases/postgres.js";

async function countRePost(postId) {
  return connection.query(`
    SELECT COUNT("postId")
    FROM shares
    WHERE "postId" = $1
  `, [postId]);
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
  deleteRePost
}