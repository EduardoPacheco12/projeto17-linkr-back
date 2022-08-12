import { Router } from "express";
import { getPost, post, getPostUser } from "../controllers/postControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";
import trendSelector from "../middlewares/trendSelector.js";

const router = Router();

router.post("/publish", PostMiddleware, trendSelector, post);
router.get("/timeline", getPost);
router.get("/posts/:userid", getPostUser);

export default router;