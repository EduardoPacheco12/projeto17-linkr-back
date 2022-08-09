import express, { json } from 'express';
import contentRouter from './routes/contentRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(contentRouter);

app.get('/', (req, res) => res.status(200).send('Servidor no ar'));

app.listen(process.env.PORT, console.log(`Server listening to PORT ${process.env.PORT} @${Date().toString()}`));