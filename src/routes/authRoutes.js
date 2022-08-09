import { Router } from "express";
import { SignIn, SignUp } from "../controllers/authControllers";
import { SignInMiddleware, SignUpMiddleware } from "../middlewares/authMiddleware";


const router = Router();

router.post("/sign-up", SignUpMiddleware, SignUp);
router.post("/", SignInMiddleware, SignIn);

export default router;