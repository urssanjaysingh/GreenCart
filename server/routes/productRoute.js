import { Router } from "express";
import { upload } from "../config/multer.js";
import { authenticate, authorize } from "./../middlewares/authMiddleware.js";
import {
    addProduct,
    changeStock,
    deleteProduct,
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
productRouter.delete("/:id", authenticate, authorize, deleteProduct);

export default productRouter;
