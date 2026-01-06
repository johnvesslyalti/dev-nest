import { followRepo } from "./follow.repository";
export const followService = {
    follow: async (followerId, followingId) => {
        if (followerId === followingId) {
            throw new Error("You cannot follow yourself");
        }
        const alreadyFollowing = await followRepo.exists(followerId, followingId);
        if (alreadyFollowing) {
            throw new Error("Already following this user");
        }
        return followRepo.create(followerId, followingId);
    },
    unfollow: async (followerId, followingId) => {
        return followRepo.delete(followerId, followingId);
    },
    getFollowers: async (userId) => {
        const followers = await followRepo.getFollowers(userId);
        return followers.map(f => f.follower);
    },
    getFollowing: async (userId) => {
        const following = await followRepo.getFollowing(userId);
        return following.map(f => f.following);
    }
};
