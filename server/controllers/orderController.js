import asyncHandler from "express-async-handler";
import stripe from "stripe";
import CustomError from "../utils/CustomError.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/index.js";

//! Place Order COD: /api/order/cod

export const placeOrderCOD = asyncHandler(async (req, res, next) => {
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
        return next(new CustomError(400, "Invalid order data"));
    }

    // Calculate Amount Using Items
    let amount = 0;

    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return next(
                new CustomError(404, `Product not found: ${item.product}`)
            );
        }

        amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    const newOrder = await Order.create({
        userId: req.user._id,
        items,
        amount,
        address,
        paymentType: "COD",
    });

    res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
        newOrder,
    });
});

//! Place Order Stripe: /api/order/stripe

export const placeOrderStripe = asyncHandler(async (req, res, next) => {
    const { items, address } = req.body;

    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
        return next(new CustomError(400, "Invalid order data"));
    }

    let productData = [];

    // Calculate Amount Using Items
    let amount = 0;

    for (const item of items) {
        const product = await Product.findById(item.product);
        productData.push({
            name: product.name,
            price: product.offerPrice,
            quantity: item.quantity,
        });
        if (!product) {
            return next(
                new CustomError(404, `Product not found: ${item.product}`)
            );
        }

        amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    const newOrder = await Order.create({
        userId: req.user._id,
        items,
        amount,
        address,
        paymentType: "Online",
    });

    // Stripe Gateway Initialize
    const stripeInstance = new stripe(STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
            },
            quantity: item.quantity,
        };
    });

    // Create Session
    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader?next=my-orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
            orderId: newOrder._id.toString(),
            userId: req.user._id.toString(),
        },
    });

    res.status(201).json({
        success: true,
        url: session.url,
    });
});

//! Stripe Webhooks to Verify Payments Action : /stripe

export const stripeWebhooks = asyncHandler(async (request, response, next) => {
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(STRIPE_SECRET_KEY);

    const signature = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            signature,
            STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).json({
            success: false,
            message: `Webhook Error: ${error.message}`,
        });
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            // Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true });

            // Clear user cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    response.json({ received: true });
});

//! Get Orders by UserId : /api/order/user

export const getUserOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({
        userId: req.user._id,
        $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
        .populate("items.product address")
        .sort({ createdAt: -1 });

    if (!orders) {
        return next(new CustomError(404, "Orders not found"));
    }

    res.status(200).json({
        success: true,
        message: "User orders fetched successfully",
        orders,
    });
});

//! Get All Orders (for seller / admin) : /api/order/seller

export const getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({
        $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
        .populate("items.product address")
        .sort({ createdAt: -1 });

    if (!orders) {
        return next(new CustomError(404, "Orders not found"));
    }

    res.status(200).json({
        success: true,
        message: "All orders fetched successfully",
        orders,
    });
});

//! Delete Order by ID : /api/order/:orderId [DELETE]

export const deleteOrderById = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new CustomError(404, "Order not found"));
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});

//! Change Order Status: /api/order/:orderId [PATCH]
export const changeOrderStatus = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
        return next(new CustomError(400, "Invalid status"));
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new CustomError(404, "Order not found"));
    }

    await Order.findByIdAndUpdate(orderId, { status });

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
    });
});
