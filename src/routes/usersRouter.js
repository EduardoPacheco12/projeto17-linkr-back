import { Router } from "express";
import { searchUser, userPicture } from "../controllers/usersControllers.js";
import { PostMiddleware } from "../middlewares/postMiddleware.js";

const router = Router();

router.get("/users", searchUser);
router.get("/users/picture", userPicture);

export default router;