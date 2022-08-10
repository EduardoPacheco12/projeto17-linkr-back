import connection from "../databases/postgres.js";

export async function getUserByName(name) {
  return connection.query(
    `SELECT id, username, "pictureUrl"
    FROM users
    WHERE username LIKE $1;`,
    [ `${ name }%` ]
  );
}