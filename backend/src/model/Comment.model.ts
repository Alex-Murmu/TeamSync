import mongoose, { InferSchemaType, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    content: { type: String, required: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    entityType: {
      type: String,
      enum: ["Task", "Project"],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    editedAt: { type: Date },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });

export type IComment = InferSchemaType<typeof CommentSchema>;
export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
