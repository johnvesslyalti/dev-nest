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
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        })
    },

    updateBio: (userId: string, bio: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: { bio },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        })
    }
}