import { followRepo } from "./follow.repository";

export const followService = {
    follow: async (followerId: string, followingId: string) => {
        if (followerId === followingId) {
            throw new Error("You cannot follow yourself");
        }

        const alreadyFollowing = await followRepo.exists(
            followerId,
            followingId
        );

        if (alreadyFollowing) {
            throw new Error("Already following this user");
        }

        return followRepo.create(followerId, followingId);
    },

    unfollow: async (followerId: string, followingId: string) => {
        return followRepo.delete(followerId, followingId)
    },
};