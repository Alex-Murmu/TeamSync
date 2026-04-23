import jwt from "jsonwebtoken"; 
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";


export interface JwtPayload {
    userId:string,
    email:string,
    role:string,
    isEmailVerified:boolean,
};





export const generateToken = (payload:JwtPayload):string=>{
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"1h"});
}   

export const verifyToken = (token:string):JwtPayload | null =>{
    try {
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload; 
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};