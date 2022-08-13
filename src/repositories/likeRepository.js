import connection from "../databases/postgres.js";

async function getLikesByPostId(postId){
  return connection.query(`
    SELECT u.username
    FROM users u
    JOIN reactions 
    ON "userId" = u.id
    WHERE reactions."postId" = $1
  `, [postId]);
}

async function addLike(userId,postId){
    return connection.query(`
    INSERT INTO
    reactions ("userId","postId")
    VALUES ($1,$2)
    `, [userId,postId]);
  }

async function removeLike(userId,postId){
    return connection.query(`
    DELETE 
    FROM reactions
    WHERE "userId" = $1 AND "postId" = $2
    `, [userId,postId]);
  }
  
  async function checkPostLiked(userId,postId){
    return connection.query(`
    SELECT *
    FROM reactions
    WHERE "userId" = $1 AND "postId" = $2
    `, [userId,postId]);
  }

  async function checkPostExist(postId){
    return connection.query(`
    SELECT *
    FROM posts
    WHERE id = $1
    `, [postId]);
  }

export const likeRepository = {
    addLike,
    removeLike,
    checkPostLiked,
    checkPostExist,
    getLikesByPostId
}