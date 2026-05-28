import { Request, Response } from "express";
import { WorkspaceService } from "../services/workspace.service.js";
import { InvitationService } from "../services/invitation.service.js";

export const CreateWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const workspace = await WorkspaceService.createWorkspace(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error creating workspace",
      error: errorMessage,
    });
  }
};

export const GetWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { workspaceId } = req.params as { workspaceId: string };
    const workspace = await WorkspaceService.getWorkspaceById(workspaceId);

    if (!workspace) {
      res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Workspace retrieved successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error retrieving workspace",
      error: errorMessage,
    });
  }
};

export const GetUserWorkspaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const workspaces = await WorkspaceService.getUserWorkspaces(userId);

    res.status(200).json({
      success: true,
      message: "Workspaces retrieved successfully",
      data: workspaces,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: "Error retrieving workspaces",
      error: errorMessage,
    });
  }
};

export const UpdateWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { workspaceId } = req.params as { workspaceId: string };
    const workspace = await WorkspaceService.updateWorkspace(workspaceId, userId, req.body);

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Insufficient permissions") ? 403 : 500;
    res.status(status).json({
      success: false,
      message: "Error updating workspace",
      error: errorMessage,
    });
  }
};

export const DeleteWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { workspaceId } = req.params as { workspaceId: string };
    await WorkspaceService.deleteWorkspace(workspaceId, userId);

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Only Owner") ? 403 : 500;
    res.status(status).json({
      success: false,
      message: "Error deleting workspace",
      error: errorMessage,
    });
  }
};

export const InviteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { workspaceId } = req.params as { workspaceId: string };
    const invitation = await InvitationService.sendInvitation(workspaceId, userId, req.body);

    res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      data: invitation,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Insufficient permissions") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error sending invitation",
      error: errorMessage,
    });
  }
};

export const AcceptInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { token } = req.params as { token: string };
    const workspace = await InvitationService.acceptInvitation(token, userId);

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Email mismatch") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error accepting invitation",
      error: errorMessage,
    });
  }
};

export const UpdateMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { workspaceId, memberId } = req.params as { workspaceId: string; memberId: string };
    const workspace = await WorkspaceService.updateMemberRole(
      workspaceId,
      memberId,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Insufficient permissions") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error updating member role",
      error: errorMessage,
    });
  }
};

export const RemoveMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { workspaceId, memberId } = req.params as { workspaceId: string; memberId: string };
    const workspace = await WorkspaceService.removeMember(workspaceId, memberId, userId);

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: workspace,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Insufficient permissions") ? 403 : 400;
    res.status(status).json({
      success: false,
      message: "Error removing member",
      error: errorMessage,
    });
  }
};
