// src/modules/block/block.service.ts
import { prisma } from "../../utils/prisma";
import { blockRepo } from "./block.repository";
export const blockService = {
    blockUser: async (blockerId, blockedId) => {
        if (blockerId == blockedId) {
            throw new Error("You cannot block yourself");
        }
        const alreadyBlocke = await blockRepo.findBlockBetweenUsers(blockerId, blockedId);
        if (alreadyBlocke) {
            throw new Error("User is already blocked.");
        }
        await prisma.$transaction([
            blockRepo.createBlock(blockerId, blockedId),
            blockRepo.deleteFollowRelations(blockerId, blockedId)
        ]);
    },
    unblockUser: async (blockerId, blockedId) => {
        await blockRepo.deleteBlock(blockerId, blockedId);
    },
    getBlockedUsers: async (userId) => {
        return blockRepo.findBlockedUsersByBlocker(userId);
    },
    isBlockedBetweenUsers: async (userA, userB) => {
        const block = await blockRepo.findBlockBetweenUsers(userA, userB);
        return Boolean(block);
    }
};
