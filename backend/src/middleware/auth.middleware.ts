import { NextFunction, Request,Response } from "express";
import { verifyToken } from "../utils/jwt.utils.js";



export const Authenticate = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const token = req.headers.authorization;
        console.log(token);

        if(!token || !token.startsWith("Bearer ")){
            res.status(401).json({
                success:false,
                message:"Unauthorized",
            });
            return;
        };
        const tokenValue = token.split(" ")[1] as string;
        const decoded = verifyToken(tokenValue);
        if(!decoded){
            res.status(401).json({
                success:false,
                message:"Invalid token",
            });
            return;
        }
        req.user = decoded;
        console.log("Authenticated user:", req.user);
        console.log("Decoded token:", decoded);
        next();
    } catch (error) {
        console.log(error)
    }
}