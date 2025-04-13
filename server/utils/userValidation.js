import Joi from "joi";

export const registerUserSchema = Joi.object({
    name: Joi.string().trim().required().messages({}),
    email: Joi.string().email().required().messages({}),
    password: Joi.string().trim().required().messages({}),
    role: Joi.string().valid("user", "seller").optional(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({}),
    password: Joi.string().required().messages({}),
});
