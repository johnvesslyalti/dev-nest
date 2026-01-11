import { Router } from "express";
import { followController } from "./follow.controller";
import { auth } from "../../middlewares/auth";
import { rateLimiter } from "../../middlewares/rateLimiter";

import { validate } from "../../middlewares/validate";
import { followSchema } from "./follow.schema";

const router = Router();

router.post(
    "/:userId",
    auth.verifyAccessToken,
    rateLimiter({ keyPrefix: "follow", limit: 30, windowInSeconds: 3600 }),
    validate(followSchema, "params"),
    followController.follow
);

router.delete(
    "/:userId",
    auth.verifyAccessToken,
    rateLimiter({ keyPrefix: "follow", limit: 30, windowInSeconds: 3600 }),
    validate(followSchema, "params"),
    followController.unfollow
);

router.get(
    "/:userId/followers",
    validate(followSchema, "params"),
    followController.followers
);

router.get(
    "/:userId/following",
    validate(followSchema, "params"),
    followController.following
);

export default router;
