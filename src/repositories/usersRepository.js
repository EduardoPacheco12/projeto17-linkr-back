import connection from "../databases/postgres.js";

async function getUserByName(name) {
  return connection.query(
    `
    SELECT id, username, "pictureUrl"
    FROM users
    WHERE username LIKE $1
    LIMIT 6;
    `,
    [ `${ name }%` ]
  );
}

async function returnPictureUser(id) {
  return connection.query(
    `SELECT "pictureUrl", username
    FROM users
    WHERE id=$1;`,
    [id]
  );
}

async function searchFollowRelation(followerId, followedId) {
  return connection.query(
    `
    SELECT * FROM relations
    WHERE follower = $1 AND followed = $2;
    `,
    [ followerId, followedId]
  );
}

async function setFollowRelation(followerId, followedId) {
  return connection.query(
    `
    INSERT INTO relations ( follower, followed )
    VALUES ( $1, $2 );
    `,
    [ followerId, followedId ]
  )
}

async function deleteFollowRelation(relationId) {
  return connection.query(
    `
    DELETE FROM relations
    WHERE id = $1;
    `,
    [ relationId ]
  )
}

async function searchFollowed(name, userId) {
  return connection.query(
    `
    SELECT users.id, users.username, users."pictureUrl",
    relations.follower
    FROM users
    JOIN relations
    ON users.id = relations.followed
    WHERE relations.follower = $1 AND
    users.username LIKE $2
    LIMIT 6;
    `,
    [ userId, `${name}%`]
  );
}

export const usersRepository = {
  getUserByName,
  returnPictureUser,
  searchFollowRelation,
  setFollowRelation,
  deleteFollowRelation,
  searchFollowed
};