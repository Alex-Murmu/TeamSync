import { verifyToken } from "../utils/jwt.utils.js";
export const Authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        if (!token || !token.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        ;
        const tokenValue = token.split(" ")[1];
        const decoded = verifyToken(tokenValue);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        req.user = decoded;
        console.log("Authenticated user:", req.user);
        console.log("Decoded token:", decoded);
        next();
    }
    catch (error) {
        console.log(error);
    }
};
//# sourceMappingURL=auth.middleware.js.map