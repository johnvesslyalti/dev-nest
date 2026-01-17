import { Router } from "express";
import { profileController } from "./profile.controller";
import { auth } from "../../middlewares/auth";
import { rateLimiter } from "../../middlewares/rateLimiter";

import { validate } from "../../middlewares/validate";
import { updateProfileSchema } from "./profile.schema";

const router = Router();

router.get("/search", profileController.searchUsers);
router.get("/:userId", auth.optionalVerifyAccessToken, profileController.getUserProfile);
router.patch(
    "/:userId",
    auth.verifyAccessToken,
    rateLimiter({ keyPrefix: "profile_update", limit: 10, windowInSeconds: 3600 }),
    validate(updateProfileSchema),
    profileController.updateUserBio
)

export default router;
