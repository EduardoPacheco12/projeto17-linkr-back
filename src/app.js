import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.get('/', (req, res) => res.status(200).send('Servidor no ar'));

app.listen(process.env.PORT);