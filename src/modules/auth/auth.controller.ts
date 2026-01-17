import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "./auth.schema";
import { authService } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth";

export const authController = {
    async register(req: Request<{}, {}, RegisterInput>, res: Response) {
        try {
            const result = await authService.register(req.body, res);
            res.json({ message: "User registered successfully", ...result });
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    },

    async login(req: Request<{}, {}, LoginInput>, res: Response) {
        try {
            const result = await authService.login(req.body, res);
            res.json({ message: "Login successful", ...result });
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            const result = await authService.refresh(req);
            res.json(result);
        } catch (e: any) {
            res.status(401).json({ message: e.message });
        }
    },

    async me(req: AuthRequest, res: Response) {
        try {
            const result = await authService.me(req.user!.id);
            res.json(result);
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    },

    async logout(req: AuthRequest, res: Response) {
        try {
            const result = await authService.logout(req.user!.id, res);
            res.json(result);
        } catch (e: any) {
            res.status(400).json({ message: e.message });
        }
    }
};
