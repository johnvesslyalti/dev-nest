// src/modules/block/block.controller.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types/express";
import { blockService } from "./block.service";

export const blockController = {
    blockUser: async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const blockerId = req.user.id;
            const blockedId = req.params.userId;

            if (!blockedId) {
                return res.status(400).json({ message: "UserId is required" });
            }

            await blockService.blockUser(blockerId, blockedId);

            res.status(201).json({ message: "User blocked successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    unblockUser: async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const blockerId = req.user.id;
            const blockedId = req.params.userId;

            await blockService.unblockUser(blockerId, blockedId);

            res.status(200).json({ message: "User unblocked successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getBlockedUsers: async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userId = req.user.id;
            const blockedUsers = await blockService.getBlockedUsers(userId);

            res.status(200).json(blockedUsers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
