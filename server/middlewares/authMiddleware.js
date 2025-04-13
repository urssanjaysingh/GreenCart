import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import { JWT_SECRET } from "../config/index.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next(
            new CustomError(
                401,
                "Not authenticated, token missing, please login to access this"
            )
        );
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new CustomError(401, "Invalid or expired token");
    }

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) {
        return next(new CustomError(401, "User not found"));
    }

    req.user = user;

    next();
});

export const authorize = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new CustomError(401, "Not authenticated"));
    }

    if (req.user.role !== "seller") {
        return next(
            new CustomError(
                403,
                "Forbidden: For Seller only, you're not authorized to access this"
            )
        );
    }

    next();
});
