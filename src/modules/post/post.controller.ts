import { Request, Response } from "express";
import { postService } from "./post.service";

export const postController = {
    async create(req: Request, res: Response) {
        const { authorId, content } = req.body;

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