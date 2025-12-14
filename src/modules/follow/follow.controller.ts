import { Response } from "express";
import { AuthRequest } from "../../types/express";
import { followService } from "./follow.service";

export const followController = {
    follow: async (req: AuthRequest, res: Response) => {
        const followerId = req.user?.id;
        const { userId: followingId } = req.body;

        if (!followerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!followingId) {
            return res.status(400).json({ message: "userId is required" });
        }

        if (followerId === followingId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        await followService.follow(followerId, followingId);

        res.status(201).json({ message: "User followed" });
    },

    unfollow: async (req: AuthRequest, res: Response) => {
        const followerId = req.user?.id;
        const { userId: followingId } = req.body;

        if (!followerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!followingId) {
            return res.status(400).json({ message: "userId is required" });
        }

        await followService.unfollow(followerId, followingId);

        res.status(200).json({ message: "User unfollowed" });
    }
};
