import { Request, Response } from "express";
import { likeInput } from "./like.schema";
import { likeService } from "./like.service";

export const likeController = {
    async like(req: Request<{ postId: string }, {}, likeInput>, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" })
            }
            const like = await likeService.like(userId, postId);
            res.json({ message: "Post liked", like })
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    },

    async unlike(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" })
            }
            await likeService.unlike(userId, postId);
            res.json({ message: "Post unliked" });
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    },

    async count(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const count = await likeService.count(postId);
            res.json({ count });
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    }
}