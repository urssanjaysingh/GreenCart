import CustomError from "../utils/CustomError.js";
import logger from "../utils/logger.js";
import { NODE_ENV } from "../config/index.js";

const errorHandler = async (err, req, res, next) => {
    const isProduction = NODE_ENV === "production";
    const statusCode = err.statusCode || 500;
    const status = err instanceof CustomError ? err.status : "Error";
    const safeMessage =
        isProduction && !(err instanceof CustomError)
            ? "Internal Server Error"
            : err.message;

    logger.error(`${err.message}`, {
        name: err.name,
        method: req.method,
        path: req.originalUrl,
        statusCode,
    });

    return res.status(statusCode).json({
        success: false,
        status,
        message: safeMessage,
        error: {
            name: err.name,
            message: safeMessage,
        },
    });
};

export default errorHandler;
