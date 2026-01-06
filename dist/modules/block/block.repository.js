// src/modules/block/block.repository.ts
import { prisma } from "../../utils/prisma";
export const blockRepo = {
    createBlock: (blockerId, blockedId) => {
        return prisma.blockedUser.create({
            data: { blockerId, blockedId }
        });
    },
    deleteBlock: (blockerId, blockedId) => {
        return prisma.blockedUser.delete({
            where: {
                blockerId_blockedId: {
                    blockedId,
                    blockerId
                }
            }
        });
    },
    findBlockBetweenUsers: (userA, userB) => {
        return prisma.blockedUser.findFirst({
            where: {
                OR: [
                    { blockerId: userA, blockedId: userB },
                    { blockerId: userB, blockedId: userA }
                ]
            }
        });
    },
    findBlockedUsersByBlocker: (blockerId) => {
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
        });
    },
    deleteFollowRelations: (userA, userB) => {
        return prisma.follow.deleteMany({
            where: {
                OR: [
                    { followerId: userA, followingId: userB },
                    { followerId: userB, followingId: userA }
                ]
            }
        });
    }
};
