import { prisma } from "../../utils/prisma"

export const profileRepo = {
    findUser: (identifier: string, currentUserId?: string) => {
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
                },
                ...(currentUserId ? {
                    followers: {
                        where: { followerId: currentUserId },
                        select: { id: true }
                    }
                } : {})
            }
        })
    },

    searchUsers: (query: string) => {
        return prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { name: { contains: query, mode: "insensitive" } }
                ]
            },
            take: 5,
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true
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