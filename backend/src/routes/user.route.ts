import { Router } from "express";
import { DeleteUserProfile, GetAllUsers, GetUserProfile, LoginUser, RegisterUser, UpdateUserProfile } from "../controllers/user.controller.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import { CreateUserSchema, LoginUserSchema } from "../validators/user.validation.js";
import { Authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",ValidateSchema(CreateUserSchema),RegisterUser);
router.post("/login",ValidateSchema(LoginUserSchema),LoginUser);
router.get("/me",Authenticate,GetUserProfile),
router.patch("/update",Authenticate,UpdateUserProfile);
router.get("/users",Authenticate,GetAllUsers);
router.delete("/delete",Authenticate,DeleteUserProfile);
export default router;