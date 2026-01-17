import { prisma } from "../../utils/prisma"

export const homeRepo = {
    getHomeFeed: (userId: string, limit: number, cursor?: string) => {
        return prisma.post.findMany({
            where: {
                OR: [
                    {
                        author: {
                            followers: {
                                some: { followerId: userId }
                            }
                        }
                    },
                    {
                        authorId: userId
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            },
            take: limit,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1
            }),
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        })
    }
}