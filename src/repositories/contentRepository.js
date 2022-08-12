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

export async function setTrendingQuery(queryData) {
  const dataToSqlString = queryData.map(i => (`\"${i}\"`) );
  const queryString = `
    WITH arr(text) AS 
    (
      VALUES('[${dataToSqlString}]')
    )
    INSERT INTO trendings(name) 
    SELECT elem::text 
    FROM arr, json_array_elements_text(text::json) elem
    ON CONFLICT (name) DO UPDATE SET name=trendings.name
    RETURNING trendings
  ;`;

  return connection.query(queryString);
}

export async function setTrendRelation(userId, trendIds) {
  const dataToSqlString = trendIds.map(i => (`\"${i}\"`) );
  const queryData = [userId];
  const queryString = `
    WITH arr(INTEGER) AS 
    (
      VALUES('[${dataToSqlString}]')
    )
    INSERT INTO trends("postId", "trendId") 
    SELECT $1, elem::INTEGER 
    FROM arr, json_array_elements_text(INTEGER::json) elem
    ON CONFLICT DO NOTHING
    RETURNING trends
  `

  return connection.query(queryString, queryData)
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