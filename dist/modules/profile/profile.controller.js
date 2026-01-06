import { profileService } from "./profile.service";
export const profileController = {
    findUserByName: async (req, res) => {
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json({ message: "Username is required" });
            }
            const user = await profileService.getUserProfile(username);
            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    updateUserBio: async (req, res) => {
        try {
            const { username } = req.params;
            const { bio } = req.body;
            if (!username) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const updatedUser = await profileService.updateUserBio(username, bio.trim());
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
