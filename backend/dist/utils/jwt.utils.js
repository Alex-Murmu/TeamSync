import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";
;
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
//# sourceMappingURL=jwt.utils.js.map