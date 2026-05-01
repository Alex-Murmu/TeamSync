import { Server as SocketIOServer, Socket } from "socket.io";
import { Message } from "../model/Message.model.js";
import { Conversation } from "../model/Conversation.model.js";
import { CallSession } from "../model/CallSession.model.js";
import { User } from "../model/User.model.js";
import { SendMessage } from "../controllers/conversation.controller.js";
import mongoose from "mongoose";
import { networkInterfaces } from "os";
interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: object;
}

interface JoinRoomData {
  conversationId: string;
}

interface SendMessageData {
  conversationId: string;
  content: string;
  contentType?: "text" | "system" | "file" | "image" | "voice-note";
}

interface CallSignalData {
  callId: string;
  type: "offer" | "answer" | "ice-candidate";
  payload: any;
  targetUserId?: string;
}

export const initSocket = (io: SocketIOServer) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Import jwt utils dynamically to avoid circular dependency
      const { verifyToken } = await import("../utils/jwt.utils.js");
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return next(new Error("Invalid token"));
      }

      socket.userId = decoded.userId;
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join a conversation room for real-time messages
    socket.on("joinRoom", async (data: JoinRoomData) => {
      try {
        const { conversationId } = data;
        
        if (!conversationId) {
          socket.emit("error", { message: "conversationId required" });
          return;
        }

        // Verify user is a member of the conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        const isMember = conversation.members.some(
          (memberId) => memberId.toString() === socket.userId
        );

        if (!isMember) {
          socket.emit("error", { message: "Forbidden: not a conversation member" });
          return;
        }

        // Join the room
        socket.join(`conversation:${conversationId}`);
        console.log(`User ${socket.userId} joined room conversation:${conversationId}`);

        // Send recent messages to the user
        const recentMessages = await Message.find({
          conversationId,
          deletedAt: null,
        })
          .populate("senderId", "firstName lastName email")
          .sort({ createdAt: -1 })
          .limit(20);

        socket.emit("messageHistory", { conversationId, messages: recentMessages.reverse() });
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Handle sending messages via WebSocket
    socket.on("sendMessage", async (data: SendMessageData) => {
      try {
        const { conversationId, content, contentType = "text" } = data;

        if (!content || !conversationId) {
          socket.emit("error", { message: "content and conversationId required" });
          return;
        }

        // Verify user is a member and conversation is not locked
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        if (conversation.isLocked) {
          socket.emit("error", { message: "Conversation is locked" });
          return;
        }

        const isMember = conversation.members.some(
          (memberId) => memberId.toString() === socket.userId
        );

        if (!isMember) {
          socket.emit("error", { message: "Forbidden: not a conversation member" });
          return;
        }

interface MessageDocument extends mongoose.Document {
  conversationId: string;
  senderId: string;
  content: string;
  contentType?:string;
  seenBy: { userId: string; seenAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
} ;

        // Create and save the message
        const message = await Message.create<MessageDocument>({
          conversationId,
          senderId: socket.userId,
          content,
          contentType,
          seenBy: [{ userId: socket.userId, seenAt: new Date() }],
          _id: new mongoose.Types.ObjectId().toString(),
        });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id).populate(
          "senderId",
          "firstName lastName email"
        );

        // Update conversation's last message
        conversation.lastMessageAt = new Date();
        conversation.lastMessageId = message._id as any;
        await conversation.save();

        // Broadcast to all users in the conversation room
        io.to(`conversation:${conversationId}`).emit("newMessage", {
          conversationId,
          message: populatedMessage,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // WebRTC signaling for calls
    socket.on("callSignal", async (data: CallSignalData) => {
      try {
        const { callId, type, payload, targetUserId } = data;

        if (!callId || !type || !payload) {
          socket.emit("error", { message: "callId, type, and payload required" });
          return;
        }

        // Verify user is part of the call
        const callSession = await CallSession.findById(callId);
        if (!callSession) {
          socket.emit("error", { message: "Call session not found" });
          return;
        }

        const isParticipant = callSession.participants.some(
          (p: any) => p.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Forbidden: not a call participant" });
          return;
        }

        // Forward the signal to other participants
        if (targetUserId) {
          // Send to specific user
          const targetSockets = await io.fetchSockets();
          const targetSocket = targetSockets.find(
            (s: any) => s.userId === targetUserId
          );
          if (targetSocket) {
            targetSocket.emit("callSignal", {
              callId,
              type,
              payload,
              fromUserId: socket.userId,
            });
          }
        } else {
          // Broadcast to all participants except sender
          socket.to(`call:${callId}`).emit("callSignal", {
            callId,
            type,
            payload,
            fromUserId: socket.userId,
          });
        }
      } catch (error) {
        console.error("Error handling call signal:", error);
        socket.emit("error", { message: "Failed to process call signal" });
      }
    });

    // Join a call room for signaling
    socket.on("joinCall", async (data: { callId: string }) => {
      try {
        const { callId } = data;

        if (!callId) {
          socket.emit("error", { message: "callId required" });
          return;
        }

        const callSession = await CallSession.findById(callId);
        if (!callSession) {
          socket.emit("error", { message: "Call session not found" });
          return;
        }

        const isParticipant = callSession.participants.some(
          (p: any) => p.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Forbidden: not a call participant" });
          return;
        }

        socket.join(`call:${callId}`);
        console.log(`User ${socket.userId} joined call room: ${callId}`);

        // Notify others in the call
        socket.to(`call:${callId}`).emit("userJoinedCall", {
          callId,
          userId: socket.userId,
        });
      } catch (error) {
        console.error("Error joining call:", error);
        socket.emit("error", { message: "Failed to join call" });
      }
    });

    // Handle user typing indicator
    socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit("userTyping", {
        conversationId: data.conversationId,
        userId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
