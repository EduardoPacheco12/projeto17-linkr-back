import Router from 'express';
import LikeControllers from '../controllers/likeController.js';

const likeRouter = Router();
const { getLikes,addOrRemoveLike } = LikeControllers;

likeRouter.get("/likes/:postId",  getLikes);
likeRouter.post("/likes/:postId",  addOrRemoveLike);

export default likeRouter;