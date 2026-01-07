import { prisma } from "../../utils/prisma"

export const profileRepo = {
    findUser: (identifier: string) => {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        })
    },

    updateBio: (username: string, bio: string) => {
        return prisma.user.update({
            where: { username: username },
            data: { bio },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        })
    }
}