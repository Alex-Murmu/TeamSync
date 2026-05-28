import mongoose, { InferSchemaType, Schema } from "mongoose";

const InvitationSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["Admin", "Member", "Viewer"],
      default: "Member",
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
    },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    acceptedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index({ token: 1 });
InvitationSchema.index({ email: 1, workspaceId: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type IInvitation = InferSchemaType<typeof InvitationSchema>;
export const Invitation = mongoose.model<IInvitation>("Invitation", InvitationSchema);
