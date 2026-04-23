import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import express from "express";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import cors from "cors";
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "sever health" });
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
connectDB()
    .then(() => {
    app.listen(port, () => {
        console.log(` Server running on http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map