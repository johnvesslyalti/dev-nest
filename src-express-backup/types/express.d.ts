import "express";
import { Request } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string
        }
    }
}

export interface AuthRequest extends Request {
    user?: { id: string };
}