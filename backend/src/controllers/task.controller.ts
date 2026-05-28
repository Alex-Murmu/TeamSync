import { Request, Response } from "express";
import { Task, ITask } from "../model/Task.model.js";
import { Project } from "../model/Project.model.js";
import { User } from "../model/User.model.js";
import { CreateTaskInput, UpdateTaskInput } from "../validators/task.validation.js";
import { Types } from "mongoose";

export const CreateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, projectId, priority, dueDate } = req.body as CreateTaskInput;
        const userId = req.user?.userId;

        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        const isCreator = project.createdBy.toString() === userId;
        const isMember = project.members.some((m: any) => m.toString() === userId);

        if (!isCreator && !isMember) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You must be a member of this project to create tasks",
            });
            return;
        }

        const createData: any = {
            title,
            projectid: projectId,
            priority,
            dueDate,
        };
        if (description) {
            createData.description = description;
        }

        const newTask = await Task.create(createData);

        const populatedTask = await Task.findById(newTask._id)
            .populate("projectid", "title description")
            .populate("assignedTo", "firstName lastName email");

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: populatedTask,
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

export const GetAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const userProjects = await (Project as any).find({
            $or: [{ createdBy: userId }, { members: userId }],
        });

        const projectIds = userProjects.map((p: any) => p._id);

        const tasks = await (Task as any).find({
            $or: [
                { assignedTo: userId },
                { projectid: { $in: projectIds } },
            ],
        })
            .populate("projectid", "title description")
            .populate("assignedTo", "firstName lastName email");

        res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks,
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

export const GetTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const task = await Task.findById(id)
            .populate("projectid", "title description")
            .populate("assignedTo", "firstName lastName email");

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        const project = await Project.findById(task.projectid);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Associated project not found",
            });
            return;
        }

        const isProjectCreator = project.createdBy.toString() === userId;
        const isProjectMember = project.members.some((m: any) => m.toString() === userId);
        const isAssigned = task.assignedTo && task.assignedTo.toString() === userId;

        if (!isProjectCreator && !isProjectMember && !isAssigned) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You do not have access to this task",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Task retrieved successfully",
            data: task,
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

export const UpdateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body as UpdateTaskInput;
        const userId = req.user?.userId;

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        const project = await Project.findById(task.projectid);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Associated project not found",
            });
            return;
        }

        const isProjectCreator = project.createdBy.toString() === userId;
        const isAssigned = task.assignedTo && task.assignedTo.toString() === userId;

        if (isProjectCreator) {
            const filteredData = Object.fromEntries(
                Object.entries(updateData).filter(([_, v]) => v !== undefined)
            ) as UpdateTaskInput;

            const updatedTask = await Task.findByIdAndUpdate(id, { $set: filteredData }, { new: true })
                .populate("projectid", "title description")
                .populate("assignedTo", "firstName lastName email");

            res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask,
            });
            return;
        }

        if (!isAssigned) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only assigned user can update this task",
            });
            return;
        }

        const allowedFields: any = { status: updateData.status };
        if (updateData.description !== undefined) {
            allowedFields.description = updateData.description;
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { $set: allowedFields }, { new: true })
            .populate("projectid", "title description")
            .populate("assignedTo", "firstName lastName email");

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
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

export const AssignTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body as { assignedTo: string };
        const userId = req.user?.userId;

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        const project = await Project.findById(task.projectid);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Associated project not found",
            });
            return;
        }

        const isProjectCreator = project.createdBy.toString() === userId;

        if (!isProjectCreator) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can assign tasks",
            });
            return;
        }

        const userExists = await User.findById(assignedTo);
        if (!userExists) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        const isProjectMember = project.members.some(
            (m: any) => m.toString() === assignedTo
        );
        const isProjectCreator2 = project.createdBy.toString() === assignedTo;

        if (!isProjectMember && !isProjectCreator2) {
            res.status(400).json({
                success: false,
                message: "User must be a member of the project to be assigned a task",
            });
            return;
        }

        task.assignedTo = new Types.ObjectId(assignedTo) as any;
        task.status = "Pending";
        await task.save();

        const updatedTask = await Task.findById(id)
            .populate("projectid", "title description")
            .populate("assignedTo", "firstName lastName email");

        res.status(200).json({
            success: true,
            message: "Task assigned successfully",
            data: updatedTask,
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

export const DeleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        const project = await Project.findById(task.projectid);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Associated project not found",
            });
            return;
        }

        const isProjectCreator = project.createdBy.toString() === userId;

        if (!isProjectCreator) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project creator can delete tasks",
            });
            return;
        }

        await Task.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
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
