import { Request, Response } from "express";
import { Conversation } from "../model/Conversation.model.js";
import { Message } from "../model/Message.model.js";
import { Project } from "../model/Project.model.js";
import { User } from "../model/User.model.js";

const isProjectMember = async (projectId: string, userId: string): Promise<boolean> => {
  const project = await Project.findById(projectId).select("admin member");
  if (!project) {
    return false;
  }

  if (project.admin.toString() === userId) {
    return true;
  }

  return project.member.some((memberId) => memberId.toString() === userId);
};

const buildDirectParticipantsHash = (firstUserId: string, secondUserId: string): string => {
  return [firstUserId, secondUserId].sort().join(":");
};

export const CreateDirectConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const { participantId, projectId } = req.body as {
      participantId: string;
      projectId: string;
    };

    if (participantId === currentUserId) {
      res.status(400).json({ success: false, message: "Cannot create direct chat with yourself" });
      return;
    }

    const [currentUserAllowed, participantAllowed] = await Promise.all([
      isProjectMember(projectId, currentUserId),
      isProjectMember(projectId, participantId),
    ]);

    if (!currentUserAllowed || !participantAllowed) {
      res.status(403).json({
        success: false,
        message: "Both users must belong to the same project",
      });
      return;
    }

    const participantExists = await User.findById(participantId).select("_id");
    if (!participantExists) {
      res.status(404).json({ success: false, message: "Participant not found" });
      return;
    }

    const participantsHash = buildDirectParticipantsHash(currentUserId, participantId);

    let conversation = await Conversation.findOne({
      type: "direct",
      projectId,
      participantsHash,
      isArchived: false,
    })
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        projectId,
        createdBy: currentUserId,
        members: [currentUserId, participantId],
        participantsHash,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("members", "firstName lastName email")
        .populate("createdBy", "firstName lastName email");
    }

    res.status(201).json({
      success: true,
      message: "Direct conversation ready",
      data: conversation,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const CreateGroupConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const { title, projectId, memberIds } = req.body as {
      title: string;
      projectId: string;
      memberIds: string[];
    };

    const uniqueMembers = [...new Set([currentUserId, ...memberIds])];

    const currentUserAllowed = await isProjectMember(projectId, currentUserId);
    if (!currentUserAllowed) {
      res.status(403).json({ success: false, message: "You are not a member of this project" });
      return;
    }

    const membershipChecks = await Promise.all(uniqueMembers.map((memberId) => isProjectMember(projectId, memberId)));
    if (membershipChecks.some((allowed) => !allowed)) {
      res.status(403).json({
        success: false,
        message: "All group members must belong to the same project",
      });
      return;
    }

    const conversation = await Conversation.create({
      type: "group",
      projectId,
      title,
      createdBy: currentUserId,
      members: uniqueMembers,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Group conversation created",
      data: populatedConversation,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const ListMyConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;

    const conversations = await Conversation.find({
      members: currentUserId,
      isArchived: false,
    })
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const GetConversationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .populate("lastMessageId");

    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    const hasAccess = conversation.members.some((memberId) => memberId.toString() === currentUserId);
    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully",
      data: conversation,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const SendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const conversationId = req.params.id as string;
    const { content, contentType, replyToMessageId } = req.body as {
      content: string;
      contentType?: "text" | "system" | "file" | "image" | "voice-note";
      replyToMessageId?: string;
    };

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    if (conversation.isLocked) {
      res.status(403).json({ success: false, message: "Conversation is locked" });
      return;
    }

    const hasAccess = conversation.members.some((memberId) => memberId.toString() === currentUserId);
    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
      return;
    }

    const createMessageData: {
      conversationId: string;
      senderId: string;
      content: string;
      contentType: "text" | "system" | "file" | "image" | "voice-note";
      seenBy: Array<{ userId: string; seenAt: Date }>;
      replyToMessageId?: string;
    } = {
      conversationId: conversation._id.toString(),
      senderId: currentUserId,
      content,
      contentType: contentType ?? "text",
      seenBy: [{ userId: currentUserId, seenAt: new Date() }],
    };

    if (replyToMessageId) {
      createMessageData.replyToMessageId = replyToMessageId;
    }

    const message = await Message.create(createMessageData);

    conversation.lastMessageAt = new Date();
    conversation.lastMessageId = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate("senderId", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const ListMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const conversationId = req.params.id as string;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const skip = (safePage - 1) * safeLimit;

    const conversation = await Conversation.findById(conversationId).select("members");
    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    const hasAccess = conversation.members.some((memberId) => memberId.toString() === currentUserId);
    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
      return;
    }

    const [messages, total] = await Promise.all([
      Message.find({ conversationId, deletedAt: null })
        .populate("senderId", "firstName lastName email")
        .populate("replyToMessageId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Message.countDocuments({ conversationId, deletedAt: null }),
    ]);

    res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: {
        messages,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};

export const MarkConversationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.userId;
    const conversationId = req.params.id as string;

    const conversation = await Conversation.findById(conversationId).select("members");
    if (!conversation) {
      res.status(404).json({ success: false, message: "Conversation not found" });
      return;
    }

    const hasAccess = conversation.members.some((memberId) => memberId.toString() === currentUserId);
    if (!hasAccess) {
      res.status(403).json({ success: false, message: "Forbidden: not a conversation member" });
      return;
    }

    await Message.updateMany(
      {
        conversationId,
        "seenBy.userId": { $ne: currentUserId },
      },
      {
        $push: {
          seenBy: {
            userId: currentUserId,
            seenAt: new Date(),
          },
        },
      }
    );

    res.status(200).json({ success: true, message: "Conversation marked as read" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: "Server error", error: errorMessage });
  }
};
