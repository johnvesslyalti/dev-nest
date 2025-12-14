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
};
