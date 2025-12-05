import { prisma } from "../../utils/prisma"
import { LoginInput, RegisterInput } from "./auth.schema"

export const authRepository = {
    findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } })
    },

    findByUsername(username: string) {
        return prisma.user.findUnique({ where: { username } })
    },

    createUser(data: RegisterInput & { password: string }) {
        return prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
            }
        })
    },

    deleteUser(data: LoginInput) {
        return prisma.user.delete({
            where: { email: data.email }
        })
    }
}