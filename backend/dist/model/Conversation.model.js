import mongoose, { Schema } from "mongoose";
const ConversationSchema = new Schema({
    type: { type: String, enum: ["direct", "group"], required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    participantsHash: { type: String, trim: true },
    lastMessageAt: { type: Date },
    lastMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
    isArchived: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
}, {
    timestamps: true,
});
ConversationSchema.index({ projectId: 1, members: 1 });
ConversationSchema.index({ projectId: 1, participantsHash: 1 }, { unique: true, sparse: true });
export const Conversation = mongoose.model("Conversation", ConversationSchema);
//# sourceMappingURL=Conversation.model.js.map