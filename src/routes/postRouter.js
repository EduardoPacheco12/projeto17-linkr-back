import { Router } from "express";
import { post } from "../controllers/postControllers";
import { PostMiddleware } from "../middlewares/postMiddleware";


const router = Router();

router.post("/publish", PostMiddleware, post);

export default router;