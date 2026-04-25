import { Router } from "express";
import { Authenticate } from "../middleware/auth.middleware.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { CallSessionIdParamSchema, CreateCallSessionSchema } from "../validators/call.validation.js";
import { CreateCallSession, EndCallSession, JoinCallSession, LeaveCallSession } from "../controllers/call.controller.js";

const router = Router();

router.post("/", Authenticate, ValidateSchema(CreateCallSessionSchema), CreateCallSession);
router.post("/:id/join", Authenticate, ValidateSchema(CallSessionIdParamSchema), JoinCallSession);
router.post("/:id/leave", Authenticate, ValidateSchema(CallSessionIdParamSchema), LeaveCallSession);
router.post("/:id/end", Authenticate, ValidateSchema(CallSessionIdParamSchema), EndCallSession);

export default router;
