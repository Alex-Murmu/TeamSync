const AthorizationMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (user.role !== requiredRole) {
            return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};
export default AthorizationMiddleware;
//# sourceMappingURL=role.authorization.js.map