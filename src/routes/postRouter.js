import { Router } from "express";
import { post } from "../controllers/postControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";


const router = Router();

router.post("/publish", PostMiddleware, post);

export default router;