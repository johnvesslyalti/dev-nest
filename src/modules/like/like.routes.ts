import { Router } from "express";
import { likeController } from "./like.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/:postId", auth.verifyAccessToken, likeController.like);
router.delete("/:postId", auth.verifyAccessToken, likeController.unlike);
router.get("/:postId", likeController.count)

export default router;