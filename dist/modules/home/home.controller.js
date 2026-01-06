import { homeService } from "./home.service";
export const homeController = {
    async getHomeFeed(req, res) {
        const userId = req.user.id;
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const cursor = req.query.cursor;
        const feed = await homeService.getHomeFeed(userId, limit, cursor);
        return res.status(200).json({
            success: true,
            ...feed
        });
    }
};
