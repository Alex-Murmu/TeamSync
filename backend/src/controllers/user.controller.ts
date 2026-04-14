import { Request,Response } from "express"
import bcrypt from "bcrypt";
import { UserRegisterInputs } from "../validators/user.validation.js"
import { User } from "../model/User.model.js";

const RegisterUser = async(req:Request,res:Response):Promise<void>=>{
  try {
    const {firstName ,lastName, email, password ,role} = req.body as unknown as UserRegisterInputs;
    const existingUserCheck = await User.findOne({email});
    if(existingUserCheck){
        res.status(402).json({
            success:false,
            message:"This email is all ready Registered",
        })
    };
  
    const hashedPassword = await bcrypt.hash(password,12);
    if(!hashedPassword){
        res.status(400).json({
            success:false,
            message:"Error on hassing password"
        });
        return;
    }
    
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        role,
    });

    if()
  } catch (error) {
    
  }
}