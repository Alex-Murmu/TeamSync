import { Request, Response } from "express";
import { CommentService } from "../services/comment.service.js";

export const CreateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const comment = await CommentService.createComment(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({
      success: false,
      message: "Error creating comment",
      error: errorMessage,
    });
  }
};

export const GetComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { entityType, entityId } = req.query as { entityType?: string; entityId?: string };

    if (!entityType || !entityId) {
      res.status(400).json({
        success: false,
        message: "entityType and entityId are required",
      });
      return;
    }

    const comments = await CommentService.getCommentsByEntity(entityType, entityId);

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error retrieving comments",
      error: errorMessage,
    });
  }
};

export const UpdateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { commentId } = req.params as { commentId: string };
    const comment = await CommentService.updateComment(commentId, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Only comment author") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error updating comment",
      error: errorMessage,
    });
  }
};

export const DeleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { commentId } = req.params as { commentId: string };
    await CommentService.deleteComment(commentId, userId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Only comment author") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error deleting comment",
      error: errorMessage,
    });
  }
};
