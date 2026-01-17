import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export const auth = {

    generateAccessToken(userId: string) {
        return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
    },

    generateRefreshToken(userId: string) {
        return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
    },

    verifyAccessToken(req: AuthRequest, res: Response, next: NextFunction) {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ message: "Unauthorized" });

        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };
            req.user = { id: decoded.id };
            next();
        } catch {
            return res.status(401).json({ message: "Access token expired or invalid" });
        }
    },

    verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, REFRESH_SECRET) as { id: string };
        } catch {
            return null;
        }
    },

    optionalVerifyAccessToken(req: AuthRequest, res: Response, next: NextFunction) {
        const header = req.headers.authorization;
        if (!header) return next();

        const token = header.split(" ")[1];
        if (!token) return next();

        try {
            const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };
            req.user = { id: decoded.id };
        } catch {
            // Ignore invalid tokens for optional auth
        }
        next();
    }
};
