import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const MONGO_URL = process.env.TEAM_SYNC_DB_URL;
        if (!MONGO_URL) {
            console.error(" TEAM_SYNC_DB_URL is not defined in environment variables");
            process.exit(1);
        }
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(" Database connection error:", error.message);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map