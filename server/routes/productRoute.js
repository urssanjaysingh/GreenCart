import { Router } from "express";
import { upload } from "../config/multer.js";
import { authenticate, authorize } from "./../middlewares/authMiddleware.js";
import {
    addProduct,
    changeStock,
    getProductById,
    productList,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.post(
    "/add",
    upload.array(["images"]),
    authenticate,
    authorize,
    addProduct
);
productRouter.get("/list", productList);
productRouter.get("/:id", getProductById);
productRouter.patch("/:id", authenticate, authorize, changeStock);

export default productRouter;
