import Router from 'express';
import LikeControllers from '../controllers/likeController.js';
import { tokenValidate } from '../middlewares/tokenValidation.js';

const likeRouter = Router();
const { getLikes,addOrRemoveLike } = LikeControllers;

likeRouter.get("/likes/:postId",tokenValidate,  getLikes);
likeRouter.post("/likes/:postId",tokenValidate,  addOrRemoveLike);

export default likeRouter;