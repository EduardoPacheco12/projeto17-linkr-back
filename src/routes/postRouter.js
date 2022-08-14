import { Router } from "express";
import { getPost, post, getPostUser } from "../controllers/postControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";
import trendSelector from "../middlewares/trendSelector.js";
import validateToken from "../middlewares/ValidateToken.js";

const router = Router();
// limpeza de dados no meio dessas paradas aqui pfv nao esquecer
router.post("/publish", PostMiddleware, trendSelector, post);
router.get("/timeline", validateToken, getPost);
router.get("/posts/:userid", validateToken, getPostUser);

export default router;