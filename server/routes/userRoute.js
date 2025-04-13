import { Router } from "express";
import { authenticate } from "./../middlewares/authMiddleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/logout", logoutUser);
userRouter.get("/me", authenticate, getCurrentUser);

export default userRouter;
