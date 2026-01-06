export const validate = (schema, source = "body") => (req, res, next) => {
    try {
        schema.parse(req[source]);
        next();
    }
    catch (e) {
        return res.status(400).json({
            message: "Validation Error",
            errors: e.errors
        });
    }
};
