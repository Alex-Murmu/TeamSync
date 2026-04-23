export const ValidateSchema = (schema) => {
    return (req, res, next) => {
        console.log("Validating schema...");
        console.log("Request body:", req.body);
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.error.flatten().fieldErrors,
            });
            return;
        }
        ;
        next();
    };
};
//# sourceMappingURL=Schema.Validation.js.map