import { Router } from "express";
import { getPost, post, getPostUser, deletePost } from "../controllers/postControllers.js";
import { deletePostMiddleware, PostMiddleware } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import trendSelector from "../middlewares/trendSelector.js";

const router = Router();
// limpeza de dados no meio dessas paradas aqui pfv nao esquecer
router.post("/publish", PostMiddleware, trendSelector, post);
router.get("/timeline", getPost);
router.get("/posts/:userid", getPostUser);
router.delete("/posts/:id", tokenValidation, deletePostMiddleware, deletePost);

export default router;