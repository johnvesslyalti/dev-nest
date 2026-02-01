import { likeRepo } from "./like.repository";
import { notificationQueue } from "../../jobs/notification.job";
import { NotificationType } from "../../generated/prisma/enums";
import { postRepo } from "../post/post.repository";

export const likeService = {
    like: async (userId: string, postId: string) => {
        const like = await likeRepo.like(userId, postId);
        
        // Trigger notification
        const post = await postRepo.findOne(postId);
        if (post && post.author.id !== userId) {
            await notificationQueue.add("like-notification", {
                type: NotificationType.LIKE,
                recipientId: post.author.id,
                actorId: userId,
                postId: postId
            });
        }

        return like;
    },

    unlike: (userId: string, postId: string) => likeRepo.unlike(userId, postId),

    count: (postId: string) => likeRepo.count(postId)
}