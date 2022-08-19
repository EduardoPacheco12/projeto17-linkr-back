import { Router } from "express";
import { getPost, post, getPostUser, deletePost, updatePost, getComments, postComments } from "../controllers/postControllers.js";
import { deleteUpdatePostMiddleware, getCommentsMiddleware, postCommentMiddleware, PostMiddleware } from "../middlewares/postMiddleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";
import trendSelector from "../middlewares/trendSelector.js";
import validateToken from "../middlewares/ValidateToken.js";

const router = Router();
router.post("/publish", PostMiddleware, trendSelector, post);
router.get("/timeline", validateToken, getPost);
router.get("/posts/:userid", validateToken, getPostUser);
router.get("/comments/:postId", tokenValidation, getCommentsMiddleware , getComments);
router.post("/comments/:postId", tokenValidation, postCommentMiddleware, postComments);
router.delete("/posts/:id", tokenValidation, deleteUpdatePostMiddleware, deletePost);
router.patch("/posts/:id", tokenValidation, trendSelector, deleteUpdatePostMiddleware, updatePost);

export default router;