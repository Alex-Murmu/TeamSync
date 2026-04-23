import { Router } from "express";
import { CreateTask, GetAllTasks, GetTaskById, UpdateTask, AssignTask, DeleteTask, } from "../controllers/task.controller.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { CreateTaskSchema, UpdateTaskSchema } from "../validators/task.validation.js";
import { Authenticate } from "../middleware/auth.middleware.js";
import AuthorizationMiddleware from "../middleware/role.authorization.js";
const router = Router();
router.post("/", ValidateSchema(CreateTaskSchema), Authenticate, AuthorizationMiddleware("ADMIN"), CreateTask);
router.get("/", Authenticate, GetAllTasks);
router.get("/:id", Authenticate, GetTaskById);
router.patch("/:id", ValidateSchema(UpdateTaskSchema), Authenticate, UpdateTask);
router.patch("/:id/assign", Authenticate, AuthorizationMiddleware("ADMIN"), AssignTask);
router.delete("/:id", Authenticate, DeleteTask);
export default router;
//# sourceMappingURL=task.route.js.map