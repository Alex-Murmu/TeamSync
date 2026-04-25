import mongoose, { Schema } from "mongoose";
const MessageSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true, required: true },
    contentType: {
        type: String,
        enum: ["text", "system", "file", "image", "voice-note"],
        default: "text",
    },
    replyToMessageId: { type: Schema.Types.ObjectId, ref: "Message" },
    editedAt: { type: Date },
    deletedAt: { type: Date },
    seenBy: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            seenAt: { type: Date, required: true, default: Date.now },
        },
    ],
    attachments: [
        {
            fileName: { type: String, trim: true },
            fileUrl: { type: String, trim: true },
            mimeType: { type: String, trim: true },
        },
    ],
}, {
    timestamps: true,
});
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
export const Message = mongoose.model("Message", MessageSchema);
//# sourceMappingURL=Message.model.js.map