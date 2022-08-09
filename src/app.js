import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Mode: ${process.env.MODE || "DEV"}`)
    console.log(`Server running on port ${process.env.PORT}`);
});