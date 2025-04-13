import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, trim: true, required: true },
        role: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ["user", "seller"],
            default: "user",
        },
        cartItems: { type: Object, default: {} },
    },
    { minimize: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    }
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
