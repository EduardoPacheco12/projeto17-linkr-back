import pg from 'pg';

const { Pool } = pg;

const databaseConfig = {
    connectionString: process.env.DATABASE_URL
};

const connection = new Pool(databaseConfig)

export default connection;