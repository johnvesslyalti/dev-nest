import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { followController } from "./follow.controller";

const router = Router();

router.post("/", auth.verifyAccessToken, followController.follow);
router.delete("/", auth.verifyAccessToken, followController.unfollow);

export default router;