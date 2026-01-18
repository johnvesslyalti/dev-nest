import { Request, Response } from "express";
import { postService } from "./post.service";
import { AuthRequest } from "../../types/express";

export const postController = {
    async create(req: AuthRequest, res: Response) {
        try {
            const { content } = req.body;
            const authorId = req.user?.id;

            if (!authorId) {
                return res.status(401).json({ message: "User not authentication" })
            }

            const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            const post = await postService.create(authorId, content, imageUrl);

            res.json({ message: "Post created", post })
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    },

    async findByUserName(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const posts = await postService.findByUserName(username);
            return res.json(posts);
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    },

    async findOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const post = await postService.findOne(id);
            res.json(post);
        } catch (e: any) {
            res.status(500).json({ message: e.message });
        }
    }
}