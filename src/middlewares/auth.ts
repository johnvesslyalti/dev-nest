import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export const auth = {

    generateToken(userId: string) {
        return jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "7d",
        });
    },

    verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            req.user = { id: decoded.id };
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
};
