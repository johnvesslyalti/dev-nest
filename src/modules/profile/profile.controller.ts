import { Request, Response } from "express";
import { profileService } from "./profile.service";

export const profileController = {
    getUserProfile: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" })
            }

            const user = await profileService.getUserProfile(userId);

            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" })
        }
    },

    updateUserBio: async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const { bio } = req.body;

            if (!username) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const updatedUser = await profileService.updateUserBio(
                username,
                bio.trim()
            );

            return res.status(200).json(updatedUser);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}