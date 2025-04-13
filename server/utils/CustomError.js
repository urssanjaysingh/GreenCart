class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        if (statusCode >= 500) {
            this.status = "Error";
        } else if (statusCode >= 400) {
            this.status = "Failed";
        } else {
            this.status = "Unknown";
        }
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
