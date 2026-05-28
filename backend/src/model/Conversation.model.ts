import mongoose, { InferSchemaType, Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    type: { type: String, enum: ["direct", "group"], required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    title: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    participantsHash: { type: String, trim: true },
    lastMessageAt: { type: Date },
    lastMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
    isArchived: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ workspaceId: 1, members: 1 });
ConversationSchema.index({ workspaceId: 1, participantsHash: 1 }, { unique: true, sparse: true });

export type IConversation = InferSchemaType<typeof ConversationSchema>;
export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);

