import express, { Router } from "express";
import {
  CreateComment,
  GetComments,
  UpdateComment,
  DeleteComment,
} from "../controllers/comment.controller.js";
import { Authenticate } from "../middleware/auth.middleware.js";
import { ValidateSchema } from "../validators/Schema.Validation.js";
import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from "../validators/comment.validation.js";

const router: Router = express.Router();

router.use(Authenticate);

router.post("/", ValidateSchema(CreateCommentSchema), CreateComment);
router.get("/", GetComments);
router.patch("/:commentId", ValidateSchema(UpdateCommentSchema), UpdateComment);
router.delete("/:commentId", DeleteComment);

export default router;
