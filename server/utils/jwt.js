import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

const genToken = async (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "7d",
    });
};

export default genToken;
