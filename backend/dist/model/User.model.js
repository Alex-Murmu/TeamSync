import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
    firstName: { type: String, trim: true, required: true, unique: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
    isEmailVerified: { type: Boolean, default: false },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", UserSchema);
//# sourceMappingURL=User.model.js.map