import { cacheKeys } from "../../utils/cacheKeys";
import { redis } from "../../utils/redis";
import { commentRepository } from "./comment.repository";

const COMMENTS_TTL = 60;

export const commentService = {
    create: async (userId: string, postId: string, content: string) => {
        const comment = await commentRepository.create(userId, postId, content);

        // Invalidate ALL cached pages for this post
        const pattern = `comments:${postId}:*`;
        const keys = await redis.keys(pattern);
        if (keys.length) {
            await redis.del(keys);
        }

        // Soft cache count
        await redis.del(cacheKeys.commentCount(postId));

        return {
            ...comment,
            author: comment.user,
            user: undefined
        };
    },

    findByPost: async (postId: string, page = 1, limit = 10) => {
        const cacheKey = cacheKeys.commentsByPost(postId, page, limit);

        const cached = await redis.get(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed)) return parsed;
            } catch { }
        }

        const comments = await commentRepository.findByPost(postId, page, limit);
        const mappedComments = comments.map(c => ({
            ...c,
            author: c.user,
            user: undefined
        }));

        await redis.set(
            cacheKey,
            JSON.stringify(mappedComments),
            "EX",
            COMMENTS_TTL
        );

        return mappedComments;
    },
};
