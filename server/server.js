import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import { stripeWebhooks } from "./controllers/orderController.js";
import { PORT } from "./config/index.js";

const app = express();
const port = PORT || 10000;

await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = ["https://greencart-8d9l.onrender.com"];

app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
