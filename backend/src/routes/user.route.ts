import { Router } from "express";
import { DeleteUserProfile, GetAllUsers, GetUserProfile, LoginUser, LogoutUser, RegisterUser, UpdateUserProfile } from "../controllers/user.controller.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { CreateUserSchema, LoginUserSchema, UpdateUserSchema } from "../validators/user.validation.js";
import { Authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", ValidateSchema(CreateUserSchema), RegisterUser);
router.post("/login", ValidateSchema(LoginUserSchema), LoginUser);
router.get("/me", Authenticate, GetUserProfile);
router.patch("/update", Authenticate, ValidateSchema(UpdateUserSchema), UpdateUserProfile);
router.get("/users", Authenticate, GetAllUsers);
router.post("/logout", Authenticate, LogoutUser);
router.delete("/delete", Authenticate, DeleteUserProfile);
export default router;