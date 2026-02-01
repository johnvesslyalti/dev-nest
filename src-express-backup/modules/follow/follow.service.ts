import { constants } from "node:vm";
import { followRepo } from "./follow.repository";
import { notificationQueue } from "../../jobs/notification.job";
import { NotificationType } from "../../generated/prisma/enums";

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

        const follow = await followRepo.create(followerId, followingId);

        await notificationQueue.add("follow-notification", {
            type: NotificationType.FOLLOW,
            recipientId: followingId,
            actorId: followerId
        });

        return follow;
    },

    unfollow: async (followerId: string, followingId: string) => {
        return followRepo.delete(followerId, followingId)
    },

    getFollowers: async (userId: string) => {
        const followers = await followRepo.getFollowers(userId);
        
        return followers.map(f => f.follower)
    },

    getFollowing: async (userId: string) => {
        const following = await followRepo.getFollowing(userId);

        return following.map(f => f.following)
    }
};