import { commentRepository } from "./comment.repository";
import { commentInput } from "./comment.schema";

export const commentService = {
    create: (userId: string, postId: string, content: string) => {
        return commentRepository.create(userId, postId, content);
    },

    findByPost: (postId: string) => commentRepository.findByPost(postId)
};
