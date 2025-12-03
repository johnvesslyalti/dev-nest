import { prisma } from "../../utils/prisma"

export const postRepo = {
    create: (authorId: string, content: string) => {
        return prisma.post.create({
            data: { authorId, content }
        });
    },

    findAll: () => {
        return prisma.post.findMany({
            include: {
                author: true,
                _count: { select: { likes: true, comments: true } }
            },
            orderBy: { createdAt: "desc" },
        })
    },

    findOne: (id: string) => {
        return prisma.post.findUnique({
            where: { id },
            include: { author: true }
        })
    }
}