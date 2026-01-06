import { authService } from "./auth.service";
export const authController = {
    async register(req, res) {
        try {
            const result = await authService.register(req.body, res);
            res.json({ message: "User registered successfully", ...result });
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    async login(req, res) {
        try {
            const result = await authService.login(req.body, res);
            res.json({ message: "Login successful", ...result });
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    async refresh(req, res) {
        try {
            const result = await authService.refresh(req);
            res.json(result);
        }
        catch (e) {
            res.status(401).json({ message: e.message });
        }
    },
    async logout(req, res) {
        try {
            const result = await authService.logout(req.user.id, res);
            res.json(result);
        }
        catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
};
