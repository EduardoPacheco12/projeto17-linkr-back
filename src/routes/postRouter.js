import { Router } from "express";
import { getPost, post, getPostUser, deletePost, updatePost } from "../controllers/postControllers.js";
import { deleteUpdatePostMiddleware, PostMiddleware } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import trendSelector from "../middlewares/trendSelector.js";
import validateToken from "../middlewares/ValidateToken.js";

const router = Router();
// limpeza de dados no meio dessas paradas aqui pfv nao esquecer
router.post("/publish", PostMiddleware, trendSelector, post);
router.get("/timeline", validateToken, getPost);
router.get("/posts/:userid", validateToken, getPostUser);
router.delete("/posts/:id", tokenValidation, deleteUpdatePostMiddleware, deletePost);
router.patch("/posts/:id", tokenValidation, trendSelector, deleteUpdatePostMiddleware, updatePost);

export default router;