import mongoose, { Schema } from "mongoose";
const QnaSchema = new Schema({
    question: { type: String, required: true, trim: true },
    answer: { type: String, trim: true, default: "" },
    askedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answeredBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "answered", "closed"], default: "pending" },
}, {
    timestamps: true,
});
export const Qna = mongoose.model("Qna", QnaSchema);
//# sourceMappingURL=Qna.model.js.map