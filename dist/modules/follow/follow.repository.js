import { prisma } from "../../utils/prisma";
export const followRepo = {
    create: (followerId, followingId) => prisma.follow.create({
        data: { followerId, followingId },
    }),
    delete: (followerId, followingId) => prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    }),
    exists: (followerId, followingId) => prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    }),
    getFollowers: (userId) => prisma.follow.findMany({
        where: {
            followingId: userId,
        },
        include: {
            follower: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                }
            }
        }
    }),
    getFollowing: (userId) => prisma.follow.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true
                }
            }
        }
    })
};
