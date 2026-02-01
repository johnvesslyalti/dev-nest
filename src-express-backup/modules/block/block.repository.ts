// src/modules/block/block.repository.ts
import { prisma } from "../../utils/prisma"

export const blockRepo = {
    createBlock: (blockerId: string, blockedId: string) => {
        return prisma.blockedUser.create({
            data: { blockerId, blockedId }
        });
    },

    deleteBlock: (blockerId: string, blockedId: string) => {
        return prisma.blockedUser.delete({
            where: {
                blockerId_blockedId: {
                    blockedId,
                    blockerId
                }
            }
        })
    },

    findBlockBetweenUsers: (userA: string, userB: string) => {
        return prisma.blockedUser.findFirst({
            where: {
                OR: [
                    { blockerId: userA, blockedId: userB },
                    { blockerId: userB, blockedId: userA }
                ]
            }
        })
    },

    findBlockedUsersByBlocker: (blockerId: string) => {
        return prisma.blockedUser.findMany({
            where: { blockerId },
            include: {
                blocked: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
    },

    deleteFollowRelations: (userA: string, userB: string) => {
        return prisma.follow.deleteMany({
            where: {
                OR: [
                    { followerId: userA, followingId: userB },
                    { followerId: userB, followingId: userA }
                ]
            }
        })
    }
}
