import { NextFunction ,Request,Response} from "express";
import { ZodSchema } from "zod";


export const ValidateSchema = (schema:ZodSchema)=>{
    return(req:Request,res:Response,next:NextFunction):void=>{
        console.log("Validating schema...");
        console.log("Request body:", req.body);
         const result = schema.safeParse({
            body:req.body,
            query:req.query,
            params:req.params,
         });

         if(!result.success){
            res.status(400).json({
                success:false,
                message:result.error.flatten().fieldErrors,
            });
            return;
         };
         next();
    }
}