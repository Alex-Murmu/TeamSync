import { email, z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    firstName: z
      .string("First Name is Required")
      .trim()
      .min(5, "First name should be at least 5 characters"),
    
    lastName: z
      .string("last name is rquired")
      .trim()
      .min(3, "Last name should be at least 3 characters"),
    
    email: z
      .string( "Email is required")
      .trim()
      .email("Invalid email format"),
    
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters for security"),
    role: z.enum(["ADMIN", "MEMBER"]).optional().default("MEMBER"),
  }),
});


export const UpdateUserSchema = z.object({
    body:z.object({
       firstName:z
         .string()
         .trim()
         .min(5 ,"Atlest 5 Character") 
         .optional(),
       lastName:z 
         .string()
         .trim()
         .min(5,"Atleast  character")
         .optional(),

        email:z
          .string()
          .trim()
          .email()
          .optional(),
        role:z
          .enum(["ADMIN","MEMBER"])
          .optional(),
        password:z
          .string()
          .trim()
          .min(7,"altest length should be 7")
          .optional()
    })
})

export type UserUpdateInputs = z.infer<typeof UpdateUserSchema>["body"];
export type UserRegisterInputs = z.infer<typeof CreateUserSchema>["body"];