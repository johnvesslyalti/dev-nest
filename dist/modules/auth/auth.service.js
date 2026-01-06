import { auth } from "../../middlewares/auth";
import { authRepository } from "./auth.repository";
import bcrypt from "bcrypt";
export const authService = {
    async register(data, res) {
        const { name, username, email, password } = data;
        const emailExists = await authRepository.findByEmail(email);
        if (emailExists)
            throw new Error("Email already exists");
        const usernameExists = await authRepository.findByUsername(username);
        if (usernameExists)
            throw new Error("Username already exists");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser({
            ...data,
            password: hashedPassword,
        });
        const accessToken = auth.generateAccessToken(user.id);
        const refreshToken = auth.generateRefreshToken(user.id);
        await authRepository.saveRefreshToken(user.id, refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { id: user.id, name: user.name, email: user.email, accessToken };
    },
    async login(data, res) {
        const { email, password } = data;
        const user = await authRepository.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            throw new Error("Invalid credentials");
        const accessToken = auth.generateAccessToken(user.id);
        const refreshToken = auth.generateRefreshToken(user.id);
        await authRepository.saveRefreshToken(user.id, refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return { id: user.id, name: user.name, email: user.email, accessToken };
    },
    async refresh(req) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            throw new Error("No refresh token");
        const user = await authRepository.findByRefreshToken(refreshToken);
        if (!user)
            throw new Error("Invalid refresh token");
        const decoded = auth.verifyRefreshToken(refreshToken);
        if (!decoded)
            throw new Error("Expired refresh token");
        const newAccessToken = auth.generateAccessToken(user.id);
        return { accessToken: newAccessToken };
    },
    async logout(userId, res) {
        await authRepository.clearRefreshToken(userId);
        res.clearCookie("refreshToken");
        return { message: "Logged out successfully" };
    }
};
