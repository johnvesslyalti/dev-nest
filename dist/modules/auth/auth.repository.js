import { prisma } from "../../utils/prisma";
export const authRepository = {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    findByUsername(username) {
        return prisma.user.findUnique({ where: { username } });
    },
    createUser(data) {
        return prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
            }
        });
    },
    deleteUser(data) {
        return prisma.user.delete({ where: { email: data.email } });
    },
    saveRefreshToken(userId, refreshToken) {
        return prisma.user.update({
            where: { id: userId },
            data: { refreshToken }
        });
    },
    clearRefreshToken(userId) {
        return prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        });
    },
    findByRefreshToken(refreshToken) {
        return prisma.user.findFirst({ where: { refreshToken } });
    }
};
