import { commentRepository } from "./comment.repository";
import { commentInput } from "./comment.schema";

export const commentService = {
    create: (data: commentInput) => {
        const { userId, postId, content } = data;
        return commentRepository.create(userId, postId, content);
    },

    findByPost: (postId: string) => commentRepository.findByPost(postId)
};
