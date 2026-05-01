import dotenv from "dotenv";
import { CorsOptions } from "cors";
dotenv.config();
import { connectDB } from "./config/db.js";
import express, {Request,Response} from "express";
import userRoutes from "./routes/user.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import conversationRoutes from "./routes/conversation.route.js";
import callRoutes from "./routes/call.route.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";
const port = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", credentials: true },
  transports: ["websocket", "polling"],
});
initSocket(io);

app.use(express.json());
app.use(cors());


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({success:true,message:"sever health"})
});

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/projects",projectRoutes);
app.use("/api/v1/tasks",taskRoutes);
app.use("/api/v1/conversations",conversationRoutes);
app.use("/api/v1/calls",callRoutes);

connectDB()
    .then(() => {
        const serverPort = port || 3000;
        httpServer.listen(serverPort, () => {
            console.log(` Server running on http://localhost:${serverPort}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });


