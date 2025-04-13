import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "error",
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${
                stack || ""
            }`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log" }),
    ],
});

export default logger;
