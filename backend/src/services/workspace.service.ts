import { Workspace } from "../model/Workspace.model.js";
import { CreateWorkspaceInputs, UpdateWorkspaceInputs, UpdateMemberRoleInputs } from "../validators/workspace.validation.js";
import { Types } from "mongoose";

export class WorkspaceService {
  static async createWorkspace(userId: string, data: CreateWorkspaceInputs) {
    const workspace = await Workspace.create({
      name: data.name,
      description: data.description || null,
      createdBy: new Types.ObjectId(userId),
      members: [
        {
          userId: new Types.ObjectId(userId),
          role: "Owner",
        },
      ],
    });
    const populated = await workspace.populate("members.userId", "firstName lastName email");
    return populated;
  }

  static async getWorkspaceById(workspaceId: string) {
    const workspace = await Workspace.findById(workspaceId)
      .populate("members.userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    return workspace;
  }

  static async getUserWorkspaces(userId: string) {
    return Workspace.find({ "members.userId": new Types.ObjectId(userId) })
      .populate("members.userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
  }

  static async updateWorkspace(workspaceId: string, userId: string, data: UpdateWorkspaceInputs) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const memberRole = workspace.members.find((m) => m.userId.toString() === userId);
    if (!memberRole || !["Owner", "Admin"].includes(memberRole.role)) {
      throw new Error("Insufficient permissions to update workspace");
    }

    return Workspace.findByIdAndUpdate(workspaceId, data, { new: true })
      .populate("members.userId", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
  }

  static async deleteWorkspace(workspaceId: string, userId: string) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const memberRole = workspace.members.find((m) => m.userId.toString() === userId);
    if (!memberRole || memberRole.role !== "Owner") {
      throw new Error("Only Owner can delete workspace");
    }

    return Workspace.findByIdAndDelete(workspaceId);
  }

  static async updateMemberRole(
    workspaceId: string,
    targetUserId: string,
    requestorId: string,
    data: UpdateMemberRoleInputs
  ) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const requestorRole = workspace.members.find((m) => m.userId.toString() === requestorId);
    if (!requestorRole || !["Owner", "Admin"].includes(requestorRole.role)) {
      throw new Error("Insufficient permissions to update member role");
    }

    const memberIndex = workspace.members.findIndex((m) => m.userId.toString() === targetUserId);
    if (memberIndex === -1) throw new Error("User is not a member of this workspace");

    const targetMember = workspace.members[memberIndex];
    if (!targetMember) throw new Error("Member not found");

    if (targetMember.role === "Owner" && requestorRole.role !== "Owner") {
      throw new Error("Only Owner can modify Owner role");
    }

    targetMember.role = data.role;
    await workspace.save();

    return workspace.populate("members.userId", "firstName lastName email");
  }

  static async removeMember(workspaceId: string, targetUserId: string, requestorId: string) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    const requestorRole = workspace.members.find((m) => m.userId.toString() === requestorId);
    if (!requestorRole || !["Owner", "Admin"].includes(requestorRole.role)) {
      throw new Error("Insufficient permissions to remove member");
    }

    const memberIndex = workspace.members.findIndex((m) => m.userId.toString() === targetUserId);
    if (memberIndex === -1) throw new Error("User is not a member of this workspace");

    const targetMember = workspace.members[memberIndex];
    if (!targetMember) throw new Error("Member not found");

    if (targetMember.role === "Owner") {
      throw new Error("Cannot remove Owner from workspace");
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    return workspace.populate("members.userId", "firstName lastName email");
  }
}
