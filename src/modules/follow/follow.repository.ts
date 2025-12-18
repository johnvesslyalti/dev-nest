import { prisma } from "../../utils/prisma";


export const followRepo = {
    create: (followerId: string, followingId: string) =>
        prisma.follow.create({
            data: { followerId, followingId },
        }),

    delete: (followerId: string, followingId: string) =>
        prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        }),

    exists: (followerId: string, followingId: string) =>
        prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        }),

    getFollowers: (userId: string) =>
        prisma.follow.findMany({
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

    getFollowing: (userId: string) =>
        prisma.follow.findMany({
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
