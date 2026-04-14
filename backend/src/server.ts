import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import express, {Request,Response} from "express";
import cors from "cors";
const port = process.env.PORT;
const app = express();
app.use(cors());


app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({success:true,message:"sever health"})
});

console.log("server is Running")

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


