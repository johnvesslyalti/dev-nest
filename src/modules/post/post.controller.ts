import { Request, Response } from "express";
import { postService } from "./post.service";
import { AuthRequest } from "../../middlewares/auth";

export const postController = {
    async create(req: AuthRequest, res: Response) {
        const { content } = req.body;

        const authorId = req.user?.id;

        if (!authorId) {
            return res.status(401).json({ message: "User not authentication" })
        }

        const post = await postService.create(authorId, content);

        res.json({ message: "Post created", post })
    },

    async findAll(req: Request, res: Response) {
        const posts = await postService.findAll();
        res.json(posts);
    },

    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        const post = await postService.findOne(id);
        res.json(post);
    }
}