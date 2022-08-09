import connection from "../databases/postgres.js";

export async function getContentQuery({ data }) {

  const queryData = [data];

  const queryString = `
    SELECT 
      t.name
      ARRAY(
        SELECT json_build_object(
          'id', id,
          'data', data,
          'time', time
        ) FROM posts WHERE id=t."postId"
      ) AS posts
    FROM 
      trendings t
    WHERE 
      id=$1
    ORDER BY time DESC
    LIMIT 10
  ;`;

  return connection.query(queryString, queryData);
}

export async function setTrendingQuery({ data }) {

  const queryData = [data]

  const queryString = `
    INSERT INTO
      trendings
    SELECT $1
    WHERE NOT EXISTS (SELECT name FROM data WHERE name NOT ILIKE $1)
  ;`;

  return connection.query(queryString, queryData);
}

export async function getTrendingQuery({ data }) {

  const queryData = [data];

  const queryString = `
    SELECT ta.id, tr.name hashtag
    JOIN trendings AS tr ON tr.id = ta.id
    FROM tags ta
    GROUP BY ta.id
    LIMIT 5
  ;`;

  return connection.query(queryString, queryData);
}