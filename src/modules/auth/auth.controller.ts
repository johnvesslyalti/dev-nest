import { Request, Response } from "express";
import { LoginInput, RegisterInput } from "./auth.schema";
import { authService } from "./auth.service";

export const authController = {
    async register(req: Request<{}, {}, RegisterInput>, res: Response) {
        try {
            const result = await authService.register(req.body)
            res.json({ message: "User registered successfully", ...result })
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    },
    async login(req: Request<{}, {}, LoginInput>, res: Response) {
        try {
            const result = await authService.login(req.body);
            res.json({ message: "Login successful", ...result })
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    },

    async delete(req: Request<{}, {}, LoginInput>, res: Response) {
        try {
            await authService.deleteUser(req.body)
            res.json({ message: "User Deleted Successfully" })
        } catch (e: any) {
            res.status(400).json({ message: e.message })
        }
    }
}