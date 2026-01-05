// src/modules/block/block.routes.ts
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { blockController } from "./block.controller";

import { validate } from "../../middlewares/validate";
import { blockSchema } from "./block.schema";

const router = Router()

router.post("/:userId", auth.verifyAccessToken, validate(blockSchema, "params"), blockController.blockUser)
router.delete("/:userId", auth.verifyAccessToken, validate(blockSchema, "params"), blockController.unblockUser);
router.get("/", auth.verifyAccessToken, blockController.getBlockedUsers)

export default router;