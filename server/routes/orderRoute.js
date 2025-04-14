import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
    changeOrderStatus,
    deleteOrderById,
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
orderRouter.delete("/:orderId", authenticate, authorize, deleteOrderById);
orderRouter.patch("/:orderId", authenticate, authorize, changeOrderStatus);

export default orderRouter;
