import { Request, Response } from "express";
import { homeService } from "./home.service"

export const homeController = {
    async getFeed(req: Request, res: Response) {
        const feed = await homeService.getFeed();
        res.json(feed)
    }
}