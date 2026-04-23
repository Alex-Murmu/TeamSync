import mongoose, { InferSchemaType, Schema } from "mongoose";

const QnaSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, trim: true, default: "" },
  askedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  answeredBy: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "answered", "closed"], default: "pending" },
}, {
  timestamps: true,
});

export type IQna = InferSchemaType<typeof QnaSchema>;
export const Qna = mongoose.model<IQna>("Qna", QnaSchema);
