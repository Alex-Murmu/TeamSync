import mongoose, { Schema } from "mongoose";
const CallSessionSchema = new Schema({
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    initiatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["voice", "video"], required: true },
    status: {
        type: String,
        enum: ["ringing", "active", "ended", "missed", "rejected"],
        default: "ringing",
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    startedAt: { type: Date },
    endedAt: { type: Date },
    endedBy: { type: Schema.Types.ObjectId, ref: "User" },
    durationSeconds: { type: Number, min: 0 },
    rtcRoomId: { type: String, trim: true },
}, {
    timestamps: true,
});
CallSessionSchema.index({ conversationId: 1, createdAt: -1 });
CallSessionSchema.index({ status: 1 });
export const CallSession = mongoose.model("CallSession", CallSessionSchema);
//# sourceMappingURL=CallSession.model.js.map