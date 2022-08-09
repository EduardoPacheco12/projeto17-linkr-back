import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const connection = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connection;