import connection from "../databases/postgres.js";

export async function getUserByName(name) {
  return connection.query(
    `SELECT name, "imageUrl"
    FROM users
    WHERE name LIKE $1;`,
    [ `${ name }%` ]
  );
}