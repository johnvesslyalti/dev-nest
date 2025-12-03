import { Request, Response } from "express";
import { commentInput } from "./comment.schema";
import { commentService } from "./comment.service";

export const commentController = {
    async create(req: Request<{}, {}, commentInput>, res: Response) {

        const comment = await commentService.create(req.body);

        res.json({ message: "comment added", comment })
    },

    async findByPost(req: Request, res: Response) {
        const { postId } = req.params;

        const comments = await commentService.findByPost(postId);

        res.json(comments);
    }
}