import Router from 'express';
import rePostControllers from '../controllers/rePostControllers.js';
import { tokenValidation } from '../middlewares/tokenValidation.js';

const rePostRouter = Router();
const { getRePosts,makeRePost } = rePostControllers ;

rePostRouter.get("/repost/:postId",tokenValidation,  getRePosts);
rePostRouter.post("/repost/:postId",tokenValidation,  makeRePost);

export default rePostRouter;