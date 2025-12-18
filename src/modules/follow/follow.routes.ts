import { Router } from "express";
import { followController } from "./follow.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
    "/:userId",
    auth.verifyAccessToken,
    followController.follow
);

router.delete(
    "/:userId",
    auth.verifyAccessToken,
    followController.unfollow
);

router.get(
    "/:userId/followers",
    followController.followers
);

router.get(
    "/:userId/following",
    followController.following
);

export default router;
