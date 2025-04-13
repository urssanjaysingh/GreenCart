import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";

//! Update User CartData : /api/cart/update

export const updateCart = asyncHandler(async (req, res, next) => {
    const { cartItems } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { cartItems } },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        return next(new CustomError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        user: updatedUser,
    });
});
