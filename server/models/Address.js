import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
        street: { type: String, trim: true, required: true },
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true },
        zipcode: { type: Number, trim: true, required: true },
        country: { type: String, trim: true, required: true },
        phone: { type: String, trim: true, required: true },
    },
    { timestamps: true }
);

const Address =
    mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
