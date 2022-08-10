import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString: process.env.DATABASE_URL
  };
  
  
    configDatabase.ssl = {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
  
  const connection = new Pool(configDatabase);

export default connection;