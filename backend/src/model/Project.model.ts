import mongoose, { InferSchemaType, Schema } from "mongoose";


const ProjectSchema = new Schema({
    title:{type:String,requied:true,trim:true,unique:true},
    description:{type:String,required:true,trim:true},
    admin:{type:Schema.Types.ObjectId,ref:"User",required:true},
    member:[{type:Schema.Types.ObjectId,ref:"User"}],
    dueDate:{type:Date,required:true},
},{
    timestamps:true,
});


export type IProject = InferSchemaType<typeof ProjectSchema>;
export const Project = mongoose.model<IProject>("Project",ProjectSchema);