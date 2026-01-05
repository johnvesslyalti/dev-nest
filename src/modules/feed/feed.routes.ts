import { Router } from "express";
import { feedController } from "./feed.controller";

import { auth } from "../../middlewares/auth";

const router = Router()

router.get(
    "/",
    auth.verifyAccessToken,
    feedController.getHomeFeed
)

export default router;
