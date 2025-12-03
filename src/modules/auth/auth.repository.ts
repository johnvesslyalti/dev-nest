import { prisma } from "../../utils/prisma"
import { RegisterInput } from "./auth.schema"

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
    }
}