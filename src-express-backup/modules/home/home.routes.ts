import { Router } from "express";
import { homeController } from "./home.controller";

import { auth } from "../../middlewares/auth";

const router = Router()

router.get(
    "/",
    auth.verifyAccessToken,
    homeController.getHomeFeed
)

export default router;
