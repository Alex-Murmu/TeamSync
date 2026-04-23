import bcrypt from "bcrypt";
import { User } from "../model/User.model.js";
import { generateToken } from "../utils/jwt.utils.js";
export const RegisterUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const existingUserCheck = await User.findOne({ email });
        if (existingUserCheck) {
            res.status(406).json({
                success: false,
                message: "This email is all ready Registered",
            });
            return;
        }
        ;
        const hashedPassword = await bcrypt.hash(password, 12);
        if (!hashedPassword) {
            res.status(400).json({
                success: false,
                message: "Error on hassing password"
            });
            return;
        }
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });
        if (!newUser) {
            res.status(400).json({
                success: false,
                message: "Error on creating user"
            });
            return;
        }
        ;
        const token = generateToken({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            isEmailVerified: newUser.isEmailVerified,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                token: token,
            },
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
export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }
        ;
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: token,
            },
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
export const GetUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
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
export const UpdateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { firstName, lastName, role } = req.body;
        const updateData = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(role && { role }),
        };
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
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
export const DeleteUserProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
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
export const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
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
//# sourceMappingURL=user.controller.js.map