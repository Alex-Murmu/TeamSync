import mongoose, { InferSchemaType, Schema } from "mongoose";


const ProjectSchema = new Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    workspaceId:{type:Schema.Types.ObjectId,ref:"Workspace",required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
    members:[{type:Schema.Types.ObjectId,ref:"User"}],
    dueDate:{type:Date,required:true},
},{
    timestamps:true,
});

ProjectSchema.index({ workspaceId: 1 });
ProjectSchema.index({ createdBy: 1 });

export type IProject = InferSchemaType<typeof ProjectSchema>;
export const Project = mongoose.model<IProject>("Project",ProjectSchema);

