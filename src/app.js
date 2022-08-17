import express, { json } from 'express';
import contentRouter from './routes/contentRouter.js';
import usersRouter from './routes/usersRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRouter.js';
import likeRouter from './routes/likeRouter.js';
import rePostRouter from './routes/rePostRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(authRoutes);
app.use(contentRouter);
app.use(usersRouter);
app.use(postRoutes);
app.use(likeRouter);
app.use(rePostRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
