import { Router } from "express";
import { getPost, post } from "../controllers/postControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";


const router = Router();

router.post("/publish", PostMiddleware, post);
router.get("/timeline", getPost);

export default router;