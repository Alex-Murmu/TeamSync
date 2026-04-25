import { CallSession } from "../model/CallSession.model.js";
import { Conversation } from "../model/Conversation.model.js";
const isConversationMember = (conversationMemberIds, userId) => {
    return conversationMemberIds.some((memberId) => memberId?.toString() === userId);
};
export const CreateCallSession = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { conversationId, type } = req.body;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ success: false, message: "Conversation not found" });
            return;
        }
        if (!isConversationMember(conversation.members, currentUserId)) {
            res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
            return;
        }
        const activeCall = await CallSession.findOne({
            conversationId,
            status: { $in: ["ringing", "active"] },
        });
        if (activeCall) {
            res.status(409).json({ success: false, message: "There is already an active call in this conversation" });
            return;
        }
        const callSession = await CallSession.create({
            conversationId,
            projectId: conversation.projectId,
            initiatorId: currentUserId,
            type,
            status: "ringing",
            participants: [currentUserId],
        });
        res.status(201).json({
            success: true,
            message: "Call session created",
            data: callSession,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
};
export const JoinCallSession = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { id } = req.params;
        const callSession = await CallSession.findById(id);
        if (!callSession) {
            res.status(404).json({ success: false, message: "Call session not found" });
            return;
        }
        if (callSession.status === "ended" || callSession.status === "missed" || callSession.status === "rejected") {
            res.status(400).json({ success: false, message: "Call session is no longer joinable" });
            return;
        }
        const conversation = await Conversation.findById(callSession.conversationId).select("members");
        if (!conversation) {
            res.status(404).json({ success: false, message: "Conversation not found" });
            return;
        }
        if (!isConversationMember(conversation.members, currentUserId)) {
            res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
            return;
        }
        const alreadyInCall = callSession.participants.some((participantId) => participantId.toString() === currentUserId);
        if (!alreadyInCall) {
            callSession.participants.push(currentUserId);
        }
        if (!callSession.startedAt) {
            callSession.startedAt = new Date();
        }
        if (callSession.status === "ringing") {
            callSession.status = "active";
        }
        await callSession.save();
        res.status(200).json({ success: true, message: "Joined call session", data: callSession });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
};
export const LeaveCallSession = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { id } = req.params;
        const callSession = await CallSession.findById(id);
        if (!callSession) {
            res.status(404).json({ success: false, message: "Call session not found" });
            return;
        }
        callSession.participants = callSession.participants.filter((participantId) => participantId.toString() !== currentUserId);
        if (callSession.participants.length === 0 && callSession.status !== "ended") {
            callSession.status = "ended";
            callSession.endedAt = new Date();
            callSession.endedBy = currentUserId;
            if (callSession.startedAt && callSession.endedAt) {
                callSession.durationSeconds = Math.max(0, Math.floor((callSession.endedAt.getTime() - callSession.startedAt.getTime()) / 1000));
            }
        }
        await callSession.save();
        res.status(200).json({ success: true, message: "Left call session", data: callSession });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
};
export const EndCallSession = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { id } = req.params;
        const callSession = await CallSession.findById(id);
        if (!callSession) {
            res.status(404).json({ success: false, message: "Call session not found" });
            return;
        }
        const conversation = await Conversation.findById(callSession.conversationId).select("members");
        if (!conversation) {
            res.status(404).json({ success: false, message: "Conversation not found" });
            return;
        }
        if (!isConversationMember(conversation.members, currentUserId)) {
            res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
            return;
        }
        if (callSession.status !== "ended") {
            callSession.status = "ended";
            callSession.endedAt = new Date();
            callSession.endedBy = currentUserId;
            if (callSession.startedAt && callSession.endedAt) {
                callSession.durationSeconds = Math.max(0, Math.floor((callSession.endedAt.getTime() - callSession.startedAt.getTime()) / 1000));
            }
            await callSession.save();
        }
        res.status(200).json({ success: true, message: "Call session ended", data: callSession });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: "Server error", error: errorMessage });
    }
};
//# sourceMappingURL=call.controller.js.map