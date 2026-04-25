import { Router } from "express";
import { Authenticate } from "../middleware/auth.middleware.js";
import { CreateDirectConversation, CreateGroupConversation, GetConversationById, ListMessages, ListMyConversations, MarkConversationRead, SendMessage, } from "../controllers/conversation.controller.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { ConversationIdParamSchema, CreateDirectConversationSchema, CreateGroupConversationSchema, ListMessagesSchema, SendMessageSchema, } from "../validators/communication.validation.js";
const router = Router();
router.post("/direct", Authenticate, ValidateSchema(CreateDirectConversationSchema), CreateDirectConversation);
router.post("/group", Authenticate, ValidateSchema(CreateGroupConversationSchema), CreateGroupConversation);
router.get("/", Authenticate, ListMyConversations);
router.get("/:id", Authenticate, ValidateSchema(ConversationIdParamSchema), GetConversationById);
router.get("/:id/messages", Authenticate, ValidateSchema(ListMessagesSchema), ListMessages);
router.post("/:id/messages", Authenticate, ValidateSchema(SendMessageSchema), SendMessage);
router.post("/:id/read", Authenticate, ValidateSchema(ConversationIdParamSchema), MarkConversationRead);
export default router;
//# sourceMappingURL=conversation.route.js.map