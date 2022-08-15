import connection from "../databases/postgres.js";

async function getPostTrends(postId) {
  return connection.query(
    `
    SELECT trends.id, trendings.name FROM trends
    JOIN trendings
    ON trends."trendId" = trendings.id
    WHERE trends."postId" = $1;
    `,
    [ postId ]
  );
}

async function deletePostTrend(trendId) {
  return connection.query(
    `
    DELETE FROM trends
    WHERE id = $1;
    `,
    [ trendId ]
  );
}

async function getTrends(trendName) {
  return connection.query(
    `
    SELECT * FROM trendings
    WHERE name = $1;
    `,
    [ trendName ]
    );
}

async function setNewTrend(trendName) {
  return connection.query(
    `INSERT INTO trendings (name)
    VALUES ($1)`,
    [ trendName ]
  )
}

async function setPostTrendRelation(postId, trendId) {
  return connection.query(
    `
    INSERT INTO trends ("postId", "trendId")
    VALUES ($1, $2);
    `,
    [ postId, trendId]
  )
}

async function getTrendId(trendName) {
  return connection.query(
    `
    SELECT id FROM trendings
    WHERE LOWER(name) = LOWER($1);
    `,
    [ trendName ]
  )
}

export const trendsRepository = {
  getPostTrends,
  deletePostTrend,
  getTrends,
  setNewTrend,
  setPostTrendRelation,
  getTrendId
}