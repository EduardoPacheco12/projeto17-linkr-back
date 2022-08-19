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

export async function getContentData(name, page) {
  
  const queryParams = [name, page];
  const queryString = `
    SELECT 
      p.id, metadatas.url, p.post AS description,
      u.username, u."pictureUrl", p."creatorId", 
      COUNT(reactions."postId") AS likes,
      COUNT(p.id) OVER() "tableLength",
      COUNT(comments."postId") AS comments,
      ARRAY(SELECT "userId" FROM reactions WHERE "postId"=p.id) AS "usersWhoLiked",
      ARRAY(SELECT users.username FROM reactions JOIN users ON users.id = reactions."userId" WHERE "postId"=p.id) AS "nameWhoLiked"
    FROM posts p 
    JOIN users u ON p."creatorId" = u.id 
    LEFT JOIN reactions ON reactions."postId" = p.id
    LEFT JOIN metadatas ON metadatas.id = p."metaId"
    LEFT JOIN comments ON comments."postId" = p.id
    JOIN trends tr ON tr."postId"=p.id WHERE tr."trendId"=(SELECT id FROM trendings WHERE name=$1)
    GROUP BY p.id, metadatas.url, p.post,
    u.username, u."pictureUrl", p."creatorId" 
    ORDER BY p."postTime" DESC 
    OFFSET 10*($2-1)
    LIMIT 10
  ;`;
  return connection.query(queryString, queryParams)
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
  ;`;

  return connection.query(queryString, queryData)
}

export async function getTrendingQuery() {
  const queryString = `
    SELECT 
      tg.name hashtag,
      COUNT(tr."trendId") top
    FROM trendings tg
    LEFT JOIN trends tr ON tr."trendId"=tg.id
    GROUP BY hashtag
    ORDER BY top DESC
    LIMIT 10
  ;`;

  return connection.query(queryString);
}