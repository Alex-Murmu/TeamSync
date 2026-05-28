import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.utils.js";

export const Authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
    ): Promise<void> => {
    try {
        let token: string | undefined;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        };
        const decoded = verifyToken(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Authentication error",
        });
    }
}
