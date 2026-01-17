import { prisma } from "../../utils/prisma"
import { LoginInput, RegisterInput } from "./auth.schema"

export const authRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    findByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } });
    },

    findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    },

    createUser(data: RegisterInput & { password: string }) {
        return prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
            }
        });
    },

    deleteUser(data: LoginInput) {
        return prisma.user.delete({ where: { email: data.email } });
    },

    saveRefreshToken(userId: string, refreshToken: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { refreshToken }
        });
    },

    clearRefreshToken(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    },

    findByRefreshToken(refreshToken: string) {
        return prisma.user.findFirst({ where: { refreshToken } });
    }
};
