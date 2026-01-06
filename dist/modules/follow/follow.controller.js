import { followService } from "./follow.service";
export const followController = {
    follow: async (req, res) => {
        try {
            const followerId = req.user?.id;
            const { userId: followingId } = req.params;
            if (!followerId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!followingId) {
                return res.status(400).json({ message: "userId is required" });
            }
            if (followerId === followingId) {
                return res.status(400).json({ message: "You cannot follow yourself" });
            }
            await followService.follow(followerId, followingId);
            res.status(201).json({ message: "User followed" });
        }
        catch (error) {
            res.status(409).json({
                message: error.message || "Already following this user"
            });
        }
    },
    unfollow: async (req, res) => {
        try {
            const followerId = req.user?.id;
            const { userId: followingId } = req.params;
            if (!followerId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!followingId) {
                return res.status(400).json({ message: "userId is required" });
            }
            await followService.unfollow(followerId, followingId);
            res.status(200).json({ message: "User unfollowed" });
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    },
    followers: async (req, res) => {
        try {
            const userId = req.params.userId;
            const followers = await followService.getFollowers(userId);
            res.status(200).json({
                count: followers.length,
                data: followers
            });
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    },
    following: async (req, res) => {
        try {
            const userId = req.params.userId;
            const following = await followService.getFollowing(userId);
            res.status(200).json({
                count: following.length,
                data: following
            });
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
};
