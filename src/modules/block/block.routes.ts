// src/modules/block/block.routes.ts
import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { blockController } from "./block.controller";

const router = Router()

router.post("/:userId", auth.verifyRefreshToken, blockController.blockUser)
router.delete("/:userId", auth.verifyRefreshToken, blockController.unblockUser);
router.get("/", auth.verifyRefreshToken, blockController.getBlockedUsers)

export default router;