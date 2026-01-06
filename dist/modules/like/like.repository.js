import { prisma } from "../../utils/prisma";
export const likeRepo = {
    like: (userId, postId) => {
        return prisma.like.create({
            data: { userId, postId }
        });
    },
    unlike: (userId, postId) => {
        return prisma.like.delete({
            where: { userId_postId: { userId, postId } }
        });
    },
    count: (postId) => {
        return prisma.like.count({ where: { postId } });
    }
};
