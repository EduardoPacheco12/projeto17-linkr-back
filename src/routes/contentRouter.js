import Router from "express";
import { listTopTrends, redirectToHashtag } from "../controllers/contentControllers.js";

const contentRouter = Router();

contentRouter.get('/hashtag/:id', redirectToHashtag);
contentRouter.get('/hashtag', listTopTrends);

export default contentRouter;