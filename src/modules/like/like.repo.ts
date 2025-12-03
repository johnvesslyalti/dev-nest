import { prisma } from "../../utils/prisma"
export const likeRepo = {
    like: (userId: string, postId: string) => {
        return prisma.like.create({
            data: { userId, postId }
        });
    },

    unlike: (userId: string, postId: string) => {
        return prisma.like.delete({
            where: { userId_postId: { userId, postId } }
        })
    },

    count: (postId: string) => {
        return prisma.like.count({ where: { postId } })
    }
}