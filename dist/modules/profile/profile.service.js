import { cacheKeys } from "../../utils/cacheKeys";
import { prisma } from "../../utils/prisma";
import { redis } from "../../utils/redis";
import { profileRepo } from "./profile.repository";
export const profileService = {
    getUserProfile: async (username) => {
        const cacheKey = cacheKeys.profileByUsername(username);
        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const profile = await profileRepo.findUserByName(username);
        if (!profile)
            return null;
        await redis.set(cacheKey, JSON.stringify(profile), "EX", 60 * 5);
        return profile;
    },
    updateUserBio: async (username, bio) => {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user)
            return null;
        const updatedProfile = await profileRepo.updateBio(username, bio);
        await redis.del(cacheKeys.profileByUserId(user.username));
        return updatedProfile;
    }
};
