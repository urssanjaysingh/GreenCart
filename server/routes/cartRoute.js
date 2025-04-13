import { Router } from "express";
import { updateCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const cartRouter = Router();

cartRouter.patch("/update", authenticate, updateCart);

export default cartRouter;
