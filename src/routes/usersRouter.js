import { Router } from "express";
import { searchUser } from "../controllers/usersControllers.js";

const router = Router();

router.get("/users", searchUser);

export default router;