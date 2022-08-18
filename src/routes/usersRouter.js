import { Router } from "express";
import { followUnfollow, searchUser, userPicture, getFollowRelation} from "../controllers/usersControllers.js";
import validateToken from "../middlewares/ValidateToken.js";

const router = Router();

router.get("/users", validateToken, searchUser);
router.get("/users/picture", userPicture);
router.post("/follow/:id", validateToken, followUnfollow);
router.get("/follow/:id", validateToken, getFollowRelation);

export default router;