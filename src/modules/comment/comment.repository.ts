import { prisma } from "../../utils/prisma"

export const commentRepository = {
    create: (userId: string, postId: string, content: string) => {
        return prisma.comment.create({
            data: { userId, postId, content },
        });
    },

    findByPost: (postId: string) => {
        return prisma.comment.findMany({
            where: { postId },
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });
    },
};