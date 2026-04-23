import { Project } from "../model/Project.model.js";
import { User } from "../model/User.model.js";
export const CreateProject = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const adminId = req.user?.userId;
        const existingProject = await Project.findOne({ title });
        if (existingProject) {
            res.status(400).json({
                success: false,
                message: "Project title already exists",
            });
            return;
        }
        const createData = {
            title,
            admin: adminId,
            dueDate,
        };
        if (description) {
            createData.description = description;
        }
        const newProject = await Project.create(createData);
        const populatedProject = await Project.findById(newProject._id)
            .populate("admin", "firstName lastName email")
            .populate("member", "firstName lastName email");
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: populatedProject,
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
export const GetAllProjects = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        let projects;
        if (userRole === "ADMIN") {
            projects = await Project.find()
                .populate("admin", "firstName lastName email")
                .populate("member", "firstName lastName email");
        }
        else {
            projects = await Project.find({
                $or: [{ admin: userId }, { member: userId }],
            })
                .populate("admin", "firstName lastName email")
                .populate("member", "firstName lastName email");
        }
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: projects,
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
export const GetProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const project = await Project.findById(id)
            .populate("admin", "firstName lastName email")
            .populate("member", "firstName lastName email");
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        const isAdmin = project.admin._id.toString() === userId;
        const isMember = project.member.some((m) => m._id.toString() === userId);
        if (userRole !== "ADMIN" && !isAdmin && !isMember) {
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
export const UpdateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.userId;
        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }
        if (project.admin.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: Only project admin can update the project",
            });
            return;
        }
        const filteredData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
        const updatedProject = await Project.findByIdAndUpdate(id, { $set: filteredData }, { new: true })
            .populate("admin", "firstName lastName email")
            .populate("member", "firstName lastName email");
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject,
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
export const AddMemberToProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;
        const adminId = req.user?.userId;
        const project = await Project.findById(id);
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
                message: "Forbidden: Only project admin can add members",
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
        if (project.member.includes(memberId)) {
            res.status(400).json({
                success: false,
                message: "User is already a member of this project",
            });
            return;
        }
        project.member.push(memberId);
        await project.save();
        const populatedProject = await Project.findById(id)
            .populate("admin", "firstName lastName email")
            .populate("member", "firstName lastName email");
        res.status(200).json({
            success: true,
            message: "Member added successfully",
            data: populatedProject,
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
export const RemoveMemberFromProject = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const adminId = req.user?.userId;
        const project = await Project.findById(id);
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
                message: "Forbidden: Only project admin can remove members",
            });
            return;
        }
        project.member = project.member.filter((m) => m.toString() !== memberId);
        await project.save();
        const populatedProject = await Project.findById(id)
            .populate("admin", "firstName lastName email")
            .populate("member", "firstName lastName email");
        res.status(200).json({
            success: true,
            message: "Member removed successfully",
            data: populatedProject,
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
export const DeleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.userId;
        const project = await Project.findById(id);
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
                message: "Forbidden: Only project admin can delete the project",
            });
            return;
        }
        await Project.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
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
//# sourceMappingURL=project.controller.js.map