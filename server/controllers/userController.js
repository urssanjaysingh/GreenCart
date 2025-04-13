import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";
import genToken from "../utils/jwt.js";
import {
    registerUserSchema,
    loginUserSchema,
} from "../utils/userValidation.js";
import { NODE_ENV } from "../config/index.js";

//! Register User : /api/user/register

export const registerUser = asyncHandler(async (req, res, next) => {
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
        const message = `The field '${error.details[0].context.key}' is missing or invalid. Please provide a valid value.`;
        return next(new CustomError(400, message));
    }

    const { name, email, password, role } = req.body;

    const existinUser = await User.findOne({ email });

    if (existinUser) {
        return next(new CustomError(409, "User already exists"));
    }

    const user = await User.create({ name, email, password, role });

    const token = await genToken(user._id);

    res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript to access cookie
        secure: NODE_ENV === "production", // Use secure cookies in production
        sameSite: NODE_ENV === "production" ? "none" : "strict", // CSRF production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    res.status(201).json({
        success: true,
        message: "New user created successfully",
        user: { name: user.name, email: user.email, role: user.role },
    });
});

//! Login User : /api/user/login

export const loginUser = asyncHandler(async (req, res, next) => {
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
        const message = `The field '${error.details[0].context.key}' is missing or invalid. Please provide a valid value.`;
        return next(new CustomError(400, message));
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new CustomError(404, "User not found"));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new CustomError(401, "Invalid credentials"));
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "User logged-in successfully",
        user: { email: user.email, name: user.name, role: user.role },
    });
});

//! Logout User : /api/user/logout

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logged-out successfully",
    });
});

//! Get logged-in user details: /api/user/me

export const getCurrentUser = (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
};
