import { Request, Response } from "express";
import { likeInput } from "./like.schema";
import { likeService } from "./like.service";

export const likeController = {
    async like(req: Request<{}, {}, likeInput>, res: Response) {
        const { postId } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" })
        }
        const like = await likeService.like(userId, postId);

        res.json({ message: "Post liked", like })
    },

    async unlike(req: Request, res: Response) {
        const { postId } = req.body;

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" })
        }

        await likeService.unlike(userId, postId);

        res.json({ message: "Post unliked" });
    },

    async count(req: Request, res: Response) {
        const { postId } = req.params;

        const count = await likeService.count(postId);

        res.json({ count });
    }
}