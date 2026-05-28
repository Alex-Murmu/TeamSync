import { Comment } from "../model/Comment.model.js";
import { Task } from "../model/Task.model.js";
import { Project } from "../model/Project.model.js";
import { CreateCommentInputs, UpdateCommentInputs } from "../validators/comment.validation.js";
import { Types, Model } from "mongoose";

export class CommentService {
  static async createComment(userId: string, data: CreateCommentInputs) {
    const Entity: Model<any> = data.entityType === "Task" ? (Task as any) : (Project as any);
    const entity = await Entity.findById(data.entityId);
    if (!entity) throw new Error(`${data.entityType} not found`);

    const comment = await Comment.create({
      content: data.content,
      authorId: new Types.ObjectId(userId),
      entityType: data.entityType,
      entityId: new Types.ObjectId(data.entityId),
    });

    return comment.populate("authorId", "firstName lastName email");
  }

  static async getCommentsByEntity(entityType: string, entityId: string) {
    const comments = await Comment.find({
      entityType,
      entityId: new Types.ObjectId(entityId),
      deletedAt: null,
    })
      .populate("authorId", "firstName lastName email")
      .sort({ createdAt: 1 });

    return comments;
  }

  static async updateComment(commentId: string, userId: string, data: UpdateCommentInputs) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.authorId.toString() !== userId) {
      throw new Error("Only comment author can edit the comment");
    }

    comment.content = data.content;
    comment.editedAt = new Date();
    await comment.save();

    return comment.populate("authorId", "firstName lastName email");
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

    if (comment.authorId.toString() !== userId) {
      throw new Error("Only comment author can delete the comment");
    }

    comment.deletedAt = new Date();
    await comment.save();

    return comment;
  }
}
