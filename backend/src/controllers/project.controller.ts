import { Request, Response } from "express";
import { Project, IProject } from "../model/Project.model.js";
import { Workspace } from "../model/Workspace.model.js";
import { User } from "../model/User.model.js";
import { CreateProjectInputs, UpdateProjectInputs } from "../validators/project.validation.js";
import { Types } from "mongoose";

export const CreateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, workspaceId, members } = req.body as CreateProjectInputs;
        const userId = req.user?.userId;
         console.log("Creating project with data:", { title, description, dueDate, workspaceId, members, userId });
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            res.status(404).json({
                success: false,
                message: "Workspace not found",
            });
            return;
        }

        const userRole = workspace.members.find((m) => m.userId.toString() === userId)?.role;
        if (!userRole || !["Owner", "Admin", "Member"].includes(userRole)) {
            res.status(403).json({
                success: false,
                message: "Insufficient permissions to create project in this workspace",
            });
            return;
        }

        const createData: any = {
            title,
            description,
            dueDate,
            workspaceId: new Types.ObjectId(workspaceId),
            createdBy: new Types.ObjectId(userId),
            members: members ? members.map((id) => new Types.ObjectId(id)) : [],
        };

        const newProject = await Project.create(createData);

        const populatedProject = await Project.findById(newProject._id)
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email");

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: populatedProject,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const GetAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { workspaceId } = req.query;

        const query: any = {
            $or: [{ createdBy: userId }, { members: userId }],
        };

        if (workspaceId) {
            query.workspaceId = new Types.ObjectId(workspaceId as string);
        }

        const projects = await Project.find(query)
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email")
            .populate("workspaceId", "name");

        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: projects,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const GetProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const project = await Project.findById(id)
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email")
            .populate("workspaceId", "name");

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        const isCreator = project.createdBy._id.toString() === userId;
        const isMember = project.members.some(
            (m: any) => m._id.toString() === userId
        );

        if (!isCreator && !isMember) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You are not a member of this project",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: project,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const UpdateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body as UpdateProjectInputs;
        const userId = req.user?.userId;

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        if (project.createdBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can update the project",
            });
            return;
        }

        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, v]) => v !== undefined)
        ) as any;

        if (filteredData.members) {
            filteredData.members = filteredData.members.map((id: string) => new Types.ObjectId(id));
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: filteredData },
            { new: true }
        )
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email")
            .populate("workspaceId", "name");

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const AddMemberToProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;
        const userId = req.user?.userId;

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        if (project.createdBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can add members",
            });
            return;
        }

        const userExists = await User.findById(memberId);
        if (!userExists) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        if (project.members.includes(new Types.ObjectId(memberId))) {
            res.status(400).json({
                success: false,
                message: "User is already a member of this project",
            });
            return;
        }

        project.members.push(new Types.ObjectId(memberId));
        await project.save();

        const populatedProject = await Project.findById(id)
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email")
            .populate("workspaceId", "name");

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            data: populatedProject,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const RemoveMemberFromProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, memberId } = req.params;
        const userId = req.user?.userId;

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        if (project.createdBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can remove members",
            });
            return;
        }

        project.members = project.members.filter(
            (m) => m.toString() !== memberId
        );
        await project.save();

        const populatedProject = await Project.findById(id)
            .populate("createdBy", "firstName lastName email")
            .populate("members", "firstName lastName email")
            .populate("workspaceId", "name");

        res.status(200).json({
            success: true,
            message: "Member removed successfully",
            data: populatedProject,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};

export const DeleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        if (project.createdBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can delete the project",
            });
            return;
        }

        await Project.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
