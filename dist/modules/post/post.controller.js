import { postService } from "./post.service";
export const postController = {
    async create(req, res) {
        try {
            const { content } = req.body;
            const authorId = req.user?.id;
            if (!authorId) {
                return res.status(401).json({ message: "User not authentication" });
            }
            const post = await postService.create(authorId, content);
            res.json({ message: "Post created", post });
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    },
    async findByUserName(req, res) {
        try {
            const { username } = req.params;
            const posts = await postService.findByUserName(username);
            return res.json(posts);
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const post = await postService.findOne(id);
            res.json(post);
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
};
