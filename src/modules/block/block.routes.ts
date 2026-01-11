// src/modules/block/block.routes.ts
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { blockController } from "./block.controller";

import { validate } from "../../middlewares/validate";
import { blockSchema } from "./block.schema";

const router = Router()

router.post("/:userId", auth.verifyAccessToken, rateLimiter({ keyPrefix: "block", limit: 50, windowInSeconds: 3600 }), validate(blockSchema, "params"), blockController.blockUser)
router.delete("/:userId", auth.verifyAccessToken, rateLimiter({ keyPrefix: "block", limit: 50, windowInSeconds: 3600 }), validate(blockSchema, "params"), blockController.unblockUser);
router.get("/", auth.verifyAccessToken, blockController.getBlockedUsers)

export default router;