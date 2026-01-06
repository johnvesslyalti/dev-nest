import { prisma } from "../../utils/prisma";
export const commentRepository = {
    create: (userId, postId, content) => {
        return prisma.comment.create({
            data: { userId, postId, content },
        });
    },
    findByPost: (postId, page, limit) => {
        return prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    },
};
