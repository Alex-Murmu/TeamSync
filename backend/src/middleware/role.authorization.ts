
import { NextFunction, Request, Response } from "express";

const AthorizationMiddleware = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }   
        if (user.role !== requiredRole) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
        } 
        next();
    };
};

export default AthorizationMiddleware;