import Joi from "joi";

export const productValidationSchema = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.array().items(Joi.string()).required(),
    price: Joi.number().positive().required(),
    offerPrice: Joi.number().positive().required(),
    category: Joi.string().required(),
    inStock: Joi.boolean().default(true),
});
