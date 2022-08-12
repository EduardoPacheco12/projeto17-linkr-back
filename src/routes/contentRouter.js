import Router from "express";
import { redirectToHashtag } from "../controllers/contentControllers.js";

const contentRouter = Router();

contentRouter.get('/hashtag/:id', redirectToHashtag);

export default contentRouter;