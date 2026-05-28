import mongoose,{InferSchemaType, Schema} from "mongoose";

const UserSchema = new Schema({
    firstName:{type:String,trim:true,required:true},
    lastName:{type:String,trim:true,required:true},
    email:{type:String,trim:true,required:true},
    password:{type:String,required:true,select:false},
    role:{type:String,enum:["ADMIN","MEMBER"],default:"MEMBER"},
    skills:[{type:String,trim:true}],
    isEmailVerified:{type:Boolean,default:false},
},{
    timestamps:true,
});


export type Iuser = InferSchemaType<typeof UserSchema>;
export const User = mongoose.model<Iuser>("User",UserSchema);

