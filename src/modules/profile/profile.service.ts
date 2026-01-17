import { cacheKeys } from "../../utils/cacheKeys"
import { prisma } from "../../utils/prisma";
import { redis } from "../../utils/redis";
import { profileRepo } from "./profile.repository";

export const profileService = {
    searchUsers: async (query: string) => {
        if (!query || query.length < 2) return [];
        return profileRepo.searchUsers(query);
    },

    getUserProfile: async (identifier: string) => {
        const cacheKeyUsername = cacheKeys.profileByUsername(identifier);
        const cacheKeyUserId = cacheKeys.profileByUserId(identifier);

        const [cachedByUsername, cachedById] = await Promise.all([
            redis.get(cacheKeyUsername),
            redis.get(cacheKeyUserId)
        ]);

        if (cachedByUsername) return JSON.parse(cachedByUsername);
        if (cachedById) return JSON.parse(cachedById);

        const profile = await profileRepo.findUser(identifier);
        if (!profile) return null

        await Promise.all([
            redis.set(
                cacheKeys.profileByUsername(profile.username),
                JSON.stringify(profile),
                "EX",
                60 * 5
            ),
            redis.set(
                cacheKeys.profileByUserId(profile.id),
                JSON.stringify(profile),
                "EX",
                60 * 5
            )
        ]);

        return profile;
    },

    updateUserBio: async (userId: string, bio: string) => {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) return null;

        const updatedProfile = await profileRepo.updateBio(userId, bio);

        await Promise.all([
            redis.del(cacheKeys.profileByUsername(user.username)),
            redis.del(cacheKeys.profileByUserId(user.id))
        ]);

        return updatedProfile;
    }
}