import connection from "../databases/postgres.js";

export async function getUserByName(name) {
  return connection.query(
    `SELECT id, username, "pictureUrl"
    FROM users
    WHERE username LIKE $1;`,
    [ `${ name }%` ]
  );
}

export async function returnPictureUser(id) {
  return connection.query(
    `SELECT "pictureUrl", username
    FROM users
    WHERE id=$1;`,
    [id]
  );
}