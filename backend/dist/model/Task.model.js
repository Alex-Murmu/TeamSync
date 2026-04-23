import mongoose, { Schema } from "mongoose";
export const TaskSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    projectid: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Pending", "Complete", "Progress"], default: "Pending" },
    priority: { type: String, enum: ["High", "Low", "Moderate"], required: true },
    dueDate: { type: Date, required: true }
}, {
    timestamps: true,
});
export const Task = mongoose.model("Task", TaskSchema);
//# sourceMappingURL=Task.model.js.map