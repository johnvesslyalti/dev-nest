import { Request, Response } from "express";
import { likeInput } from "./like.schema";
import { likeService } from "./like.service";

export const likeController = {
    async like(req: Request<{}, {}, likeInput>, res: Response) {
        const { userId, postId } = req.body;

        const like = await likeService.like(userId, postId);

        res.json({ message: "Post liked", like })
    },

    async unlike(req: Request, res: Response) {
        const { userId, postId } = req.body;

        await likeService.unlike(userId, postId);

        res.json({ message: "Post unliked" });
    },
    async count(req: Request, res: Response) {
        const { postId } = req.params;

        const count = await likeService.count(postId);

        res.json({ count });
    }
}