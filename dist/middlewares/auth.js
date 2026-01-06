import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";
export const auth = {
    generateAccessToken(userId) {
        return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
    },
    generateRefreshToken(userId) {
        return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
    },
    verifyAccessToken(req, res, next) {
        const header = req.headers.authorization;
        if (!header)
            return res.status(401).json({ message: "Unauthorized" });
        const token = header.split(" ")[1];
        try {
            const decoded = jwt.verify(token, ACCESS_SECRET);
            req.user = { id: decoded.id };
            next();
        }
        catch {
            return res.status(401).json({ message: "Access token expired or invalid" });
        }
    },
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, REFRESH_SECRET);
        }
        catch {
            return null;
        }
    }
};
