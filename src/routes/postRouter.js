import { Router } from "express";
import { getPost, post, getPostUser } from "../controllers/postControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";


const router = Router();

router.post("/publish", PostMiddleware, post);
router.get("/timeline", getPost);
router.get("/posts/:userid", getPostUser);

export default router;