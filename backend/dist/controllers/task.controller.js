import { Task } from "../model/Task.model.js";
import { Project } from "../model/Project.model.js";
import { User } from "../model/User.model.js";
export const CreateTask = async (req, res) => {
    try {
        const { title, description, projectId, priority, dueDate } = req.body;
        const adminId = req.user?.userId;
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        if (project.admin.toString() !== adminId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project admin can create tasks for this project",
            });
            return;
        }
        const createData = {
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
export const GetAllTasks = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        let tasks;
        if (userRole === "ADMIN") {
            tasks = await Task.find()
                .populate("projectid", "title description")
                .populate("assignedTo", "firstName lastName email");
        }
        else {
            const userProjects = await Project.find({
                $or: [{ admin: userId }, { member: userId }],
            });
            const projectIds = userProjects.map((p) => p._id);
            tasks = await Task.find({
                $or: [
                    { assignedTo: userId },
                    { projectid: { $in: projectIds } },
                ],
            })
                .populate("projectid", "title description")
                .populate("assignedTo", "firstName lastName email");
        }
        res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
export const GetTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;
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
        if (userRole === "ADMIN") {
            res.status(200).json({
                success: true,
                message: "Task retrieved successfully",
                data: task,
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
        const isProjectAdmin = project.admin.toString() === userId;
        const isProjectMember = project.member.some((m) => m.toString() === userId);
        const isAssigned = task.assignedTo && task.assignedTo.toString() === userId;
        if (!isProjectAdmin && !isProjectMember && !isAssigned) {
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
export const UpdateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.userId;
        const userRole = req.user?.role;
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
        const isProjectAdmin = project.admin.toString() === userId;
        const isAssigned = task.assignedTo && task.assignedTo.toString() === userId;
        if (userRole === "ADMIN" || isProjectAdmin) {
            const filteredData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
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
        const allowedFields = { status: updateData.status };
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
export const AssignTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        const adminId = req.user?.userId;
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
        if (project.admin.toString() !== adminId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project admin can assign tasks",
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
        const isProjectMember = project.member.some((m) => m.toString() === assignedTo);
        const isProjectAdmin = project.admin.toString() === assignedTo;
        if (!isProjectMember && !isProjectAdmin) {
            res.status(400).json({
                success: false,
                message: "User must be a member of the project to be assigned a task",
            });
            return;
        }
        task.assignedTo = assignedTo;
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
export const DeleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.userId;
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
            res.status(500).json({
                success: false,
                message: "Associated project not found",
            });
            return;
        }
        if (project.admin.toString() !== adminId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project admin can delete tasks",
            });
            return;
        }
        await Task.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
            success: false,
            message: "Server error",
            error: errorMessage,
        });
    }
};
//# sourceMappingURL=task.controller.js.map