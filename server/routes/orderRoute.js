import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
    getAllOrders,
    getUserOrders,
    placeOrderCOD,
    placeOrderStripe,
} from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.post("/cod", authenticate, placeOrderCOD);
orderRouter.post("/stripe", authenticate, placeOrderStripe);
orderRouter.get("/user", authenticate, getUserOrders);
orderRouter.get("/seller", authenticate, authorize, getAllOrders);

export default orderRouter;
