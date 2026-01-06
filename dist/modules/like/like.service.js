import { likeRepo } from "./like.repository";
export const likeService = {
    like: (userId, postId) => likeRepo.like(userId, postId),
    unlike: (userId, postId) => likeRepo.unlike(userId, postId),
    count: (postId) => likeRepo.count(postId)
};
