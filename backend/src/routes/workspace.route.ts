import express, { Router } from "express";
import {
  CreateWorkspace,
  GetWorkspace,
  GetUserWorkspaces,
  UpdateWorkspace,
  DeleteWorkspace,
  InviteMember,
  AcceptInvitation,
  UpdateMemberRole,
  RemoveMember,
} from "../controllers/workspace.controller.js";
import { Authenticate } from "../middleware/auth.middleware.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import {
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
  InviteMemberSchema,
  UpdateMemberRoleSchema,
} from "../validators/workspace.validation.js";
import { AcceptInvitationSchema } from "../validators/invitation.validation.js";

const router: Router = express.Router();


router.use(Authenticate);

router.post("/", ValidateSchema(CreateWorkspaceSchema), CreateWorkspace);
router.get("/", GetUserWorkspaces);
router.get("/:workspaceId", GetWorkspace);
router.patch("/:workspaceId", ValidateSchema(UpdateWorkspaceSchema), UpdateWorkspace);
router.delete("/:workspaceId", DeleteWorkspace);
router.post("/:workspaceId/invite", ValidateSchema(InviteMemberSchema), InviteMember);
router.post("/invite/:token/accept", ValidateSchema(AcceptInvitationSchema), AcceptInvitation);
router.patch(
  "/:workspaceId/members/:memberId/role",
  ValidateSchema(UpdateMemberRoleSchema),
  UpdateMemberRole
);
router.delete("/:workspaceId/members/:memberId", RemoveMember);

export default router;
