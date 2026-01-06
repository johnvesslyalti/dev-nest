import { prisma } from "../../utils/prisma";
export const profileRepo = {
    findUserByName: (username) => {
        return prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        });
    },
    updateBio: (username, bio) => {
        return prisma.user.update({
            where: { username: username },
            data: { bio },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    }
                }
            }
        });
    }
};
