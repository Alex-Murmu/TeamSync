import mongoose, { InferSchemaType, Schema } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["Owner", "Admin", "Member", "Viewer"],
          required: true,
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

WorkspaceSchema.index({ createdBy: 1 });
WorkspaceSchema.index({ "members.userId": 1 });

export type IWorkspace = InferSchemaType<typeof WorkspaceSchema>;
export const Workspace = mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
