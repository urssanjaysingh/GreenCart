import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { addAddress, getAddress } from "../controllers/addressController.js";

const addressRouter = Router();

addressRouter.post("/add", authenticate, addAddress);
addressRouter.get("/get", authenticate, getAddress);

export default addressRouter;
