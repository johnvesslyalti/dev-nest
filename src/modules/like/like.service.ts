import { likeRepo } from "./like.repo";

export const likeService = {
    like: (userId: string, postId: string) => likeRepo.like(userId, postId),

    unlike: (userId: string, postId: string) => likeRepo.unlike(userId, postId),

    count: (postId: string) => likeRepo.count(postId)
}