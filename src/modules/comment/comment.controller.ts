import { Request, Response } from "express";
import { commentSchema, CommentInput } from "./comment.schema";
import { commentService } from "./comment.service";

export const commentController = {
    create: async (
        req: Request<{ postId: string }, {}, CommentInput>,
        res: Response
    ) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { postId } = req.params;
            const { content } = commentSchema.parse(req.body);

            const comment = await commentService.create(
                userId,
                postId,
                content
            );

            res.status(201).json({
                message: "Comment added",
                comment,
            });
        } catch (err) {
            return res.status(400).json({
                message: "Invalid request",
            });
        }
    },

    findByPost: async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const comments = await commentService.findByPost(
                postId,
                page,
                limit
            );

            res.json(comments);
        } catch {
            res.status(500).json({ message: "Failed to fetch comments" });
        }
    },
};
