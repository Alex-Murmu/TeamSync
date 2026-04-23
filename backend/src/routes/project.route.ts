import { Router } from "express";
import {
    CreateProject,
    GetAllProjects,
    GetProjectById,
    UpdateProject,
    AddMemberToProject,
    RemoveMemberFromProject,
    DeleteProject,
} from "../controllers/project.controller.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { CreateProjectSchema, UpdateProjectSchema } from "../validators/project.validation.js";
import { Authenticate } from "../middleware/auth.middleware.js";
import AuthorizationMiddleware from "../middleware/role.authorization.js";

const router = Router();

router.post("/", ValidateSchema(CreateProjectSchema), Authenticate, AuthorizationMiddleware("ADMIN"), CreateProject);
router.get("/", Authenticate, GetAllProjects);
router.get("/:id", Authenticate, GetProjectById);
router.patch("/:id", ValidateSchema(UpdateProjectSchema), Authenticate, UpdateProject);
router.patch("/:id/member", Authenticate, AddMemberToProject);
router.delete("/:id", Authenticate, DeleteProject);

export default router;
